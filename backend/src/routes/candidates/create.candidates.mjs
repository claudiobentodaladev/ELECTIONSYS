import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { getUserParticipation, checkElectionEligibility } from "../../utils/sql/sql.helpers.mjs";

const router = Router()

router.post("/:election_id", autoUpdateElectionStatus, isEleitor, async (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
    const { logo_group_url, group_name, description } = request.body;

    try {
        // Verify user participation
        const participationResult = await getUserParticipation(user.id, election_id);
        if (!participationResult.success) {
            return response.status(404).json(
                new apiResponse("There's no participation with this user").error(true)
            );
        }

        const { status } = participationResult.participation;

        if (status === "ineligible") {
            return response.status(403).json(
                new apiResponse("This user is not eligible to be a candidate").error(true)
            );
        }
        if (status === "voted") {
            return response.status(403).json(
                new apiResponse("This user already voted, not available to be a candidate").error(true)
            );
        }

        // Verify if the election allows candidacies
        const eligibilityResult = await checkElectionEligibility(election_id, 'candidacy');
        if (!eligibilityResult.success) {
            return response.status(500).json(
                new apiResponse("Error checking election status").error(true)
            );
        }

        if (!eligibilityResult.canParticipate) {
            return response.status(403).json(
                new apiResponse(`Cannot create candidacy: election is ${eligibilityResult.status}`).error(true)
            );
        }

        // Insert candidate
        const insertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO candidates VALUES (default,?,?,?,?,default,default)",
                [participationResult.participation.id, logo_group_url, group_name, description],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!insertResult.success) {
            return response.status(500).json(
                new apiResponse("Error creating candidate").error(true)
            );
        }

        return response.status(201).json(
            new apiResponse("Error creating candidate").ok(insertResult)
        );

    } catch (error) {
        console.error("Error creating candidate:", error);
        return response.status(500).json(
            new create("Error creating candidate").error(true)
        );
    }
});

export default router;