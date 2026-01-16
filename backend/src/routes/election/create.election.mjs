import { Router } from "express";
import { createElection } from "../../validator/validator.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin} from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { create, found } from "../../utils/response.class.mjs";
import { verifyThemeOwnership, insertAuditLog, validateElectionDates } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.post("/:theme_id", createElection, validator, isAdmin, async (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    // Date validation: do not allow elections in the past
    if (!validateElectionDates(startDate, endDate)) {
        return response.status(400).json(new create("election").not("Invalid dates: start date must be in the future and before end date"));
    }

    try {
        // Verify if the theme belongs to the user
        const themeResult = await verifyThemeOwnership(theme_id, user.id);
        if (!themeResult.success) {
            return response.status(404).json(new found("theme").not());
        }

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