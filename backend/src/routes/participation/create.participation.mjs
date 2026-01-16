import { Router } from "express";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { create } from "../../utils/response.class.mjs";
import { getElectionInfo, getUserParticipation } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.post("/:election_id", autoUpdateElectionStatus, isEleitor, async (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    try {
        // Check if the election exists
        const electionResult = await getElectionInfo(election_id);
        if (!electionResult.success) {
            return response.status(404).json(new create("Election not found").not());
        }

        // Check if the user already participates in this election
        const participationResult = await getUserParticipation(user.id, election_id);
        if (participationResult.success) {
            return response.status(409).json(new create("User already participates in this election").not());
        }

        // Create participation
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO participation VALUES (default,?,?,default)",
                [user.id, election_id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(new create("Error creating participation").error());
        }

        return response.status(201).json(new create("participation", insertResult.insertId).ok());

    } catch (error) {
        console.error("Error creating participation:", error);
        return response.status(500).json(new create("participation").error());
    }
});

export default router;