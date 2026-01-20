import { Router } from "express";
import { election } from "../../validator/election.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { create, found } from "../../utils/response.class.mjs";
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
        new create(electionDate.error).not()
    );

    try {
        // Verify if the theme belongs to the user
        const themeResult = await verifyThemeOwnership(theme_id, user.id);
        if (!themeResult.success) return response.status(404).json(new found("theme").not());
        
        const electionTimeFree = await validateElectionInSameDates(theme_id,formatDate(startDate), formatDate(endDate))
        if (!electionTimeFree.success) return response.status(400).json(
                new create(electionTimeFree.error).not()
            )

        // Insert election
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,default)",
                [themeResult.themeId, formatDate(startDate), formatDate(endDate)],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(new create("election").error());
        }

        // Insert audit log
        const auditResult = await insertAuditLog(user.id, "ELECTION_CREATED", insertResult.insertId);
        if (!auditResult.success) {
            console.error("Failed to insert audit log:", auditResult.error);
            // Does not return error, as the election was created successfully
        }

        return response.status(201).json(new create("election", insertResult.insertId).ok());

    } catch (error) {
        console.error("Error creating election:", error);
        return response.status(500).json(new create("election").error());
    }
});

export default router;