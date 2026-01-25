import { Router } from "express";
import { election } from "../../validator/election.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { verifyThemeOwnership, insertAuditLog, validateElectionDates, validateElectionInSameDates } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.post("/:theme_id", election, validator, isAdmin, async (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    // Date validation: do not allow elections in the past
    const electionDate = await validateElectionDates(startDate, endDate)
    if (!electionDate.success) return response.status(400).json(
        new apiResponse(electionDate.message).error(true)
    );

    try {
        // Verify if the theme belongs to the user
        const themeResult = await verifyThemeOwnership(theme_id, user.id);
        if (!themeResult.success) return response.status(404).json(
            new apiResponse("This theme is not created by this users").error(true)
        );
        
        const electionTimeFree = await validateElectionInSameDates(theme_id,formatDate(startDate), formatDate(endDate))
        if (!electionTimeFree.success) return response.status(400).json(
                new apiResponse(electionTimeFree.message).error(true)
            )

        // Insert election
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,default)",
                [themeResult.themeId, formatDate(startDate), formatDate(endDate)],
                (err, result) => {
                    if (err) resolve(
                        new apiResponse(err.message).error(err)
                    );
                    else resolve(
                        new apiResponse("Inserted a new election").ok({})
                    );
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(
                new apiResponse(insertResult.message).error(true)
            );
        }

        // Insert audit log
        const auditResult = await insertAuditLog(user.id, "ELECTION_CREATED", insertResult.insertId);
        if (!auditResult.success) {
            console.error("Failed to insert audit log:", auditResult.error);
            // Does not return error, as the election was created successfully
        }

        return response.status(201).json(
            new apiResponse("created a new election").ok({})
        );

    } catch (err) {
        return response.status(500).json(
            new apiResponse(err.message).error(err)
    );
    }
});

export default router;