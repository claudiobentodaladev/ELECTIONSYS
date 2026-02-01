import { Router } from "express";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { getElectionInfo, getUserParticipation } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.post("/:election_id", autoUpdateElectionStatus, isEleitor, async (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    try {
        // Check if the election exists
        const electionResult = await getElectionInfo(election_id);
        if (!electionResult.success) {
            return response.status(404).json(
                new apiResponse(electionResult.message, request).error(true)
            );
        }

        // Check if the user already participates in this election
        const participationResult = await getUserParticipation(user.id, election_id);
        if (participationResult.success) {
            return response.status(409).json(
                new apiResponse("User already participates in this election", request).error(true)
            );
        }

        // Create participation
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO participation VALUES (default,?,?,default)",
                [user.id, election_id],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(
                new apiResponse(insertResult.message, request).error(true)
            );
        }

        return response.status(201).json(
            new apiResponse("created a new participation", request).ok({election_id})
        );

    } catch (err) {
        return response.status(500).json(
            new apiResponse(err.message, request).error(err)
        )
    }
});

export default router;