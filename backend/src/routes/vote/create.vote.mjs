import { Router } from "express";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { getUserParticipation, checkElectionEligibility, insertAuditLog } from "../../utils/sql/sql.helpers.mjs";

const router = Router()

router.post("/:candidate_id", autoUpdateElectionStatus, isEleitor, async (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;

    try {
        // Verify if the candidate exists and get election_id
        const candidateResult = await new Promise((resolve) => {
            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else if (result.length === 0) resolve({ success: false, error: "Candidate not found" });
                    else resolve({ success: true, participationId: result[0].participation_id });
                }
            );
        });

        if (!candidateResult.success) {
            return response.status(404).json(
                new apiResponse("Candidate not found").error(true)
            );
        }

        // Get election_id from participation
        const electionResult = await new Promise((resolve) => {
            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [candidateResult.participationId],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message, error: err });
                    else if (result.length === 0) resolve({ success: false, message: "Election not found", error: true });
                    else resolve({ success: true, electionId: result[0].election_id });
                }
            );
        });

        if (!electionResult.success) return response.status(404).json(
            new apiResponse(electionResult.message).error(electionResult.error)
        );

        const electionId = electionResult.electionId;

        // Verify user participation
        const participationResult = await getUserParticipation(user.id, electionId);
        if (!participationResult.success) {
            return response.status(404).json(
                new apiResponse("User has not participated in this election").error(true)
            );
        }

        // Verify if the election allows votes
        const eligibilityResult = await checkElectionEligibility(electionId, 'vote');
        if (!eligibilityResult.success) return response.status(500).json(
            new apiResponse("Error checking election status").error(true)
        );

        if (eligibilityResult.status !== 'ongoing') return response.status(403).json(
            new apiResponse(`Cannot vote: election is ${eligibilityResult.status}`).error()
        );

        // Verify if the user has already voted
        const existingVote = await new Promise((resolve) => {
            mysql.execute(
                "SELECT id FROM vote WHERE participation_id = ?",
                [participationResult.participation.id],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message });
                    else resolve({ success: true, hasVoted: result.length > 0 });
                }
            );
        });

        if (!existingVote.success) return response.status(500).json(
            new apiResponse("Error checking existing votes").error(true)
        );

        if (existingVote.hasVoted) return response.status(403).json(
            new apiResponse("User has already voted in this election").error()
        );

        // Inserir voto
        const voteInsertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO vote VALUES (default,?,?,default)",
                [participationResult.participation.id, candidate_id],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!voteInsertResult.success) return response.status(500).json(
            new apiResponse("Error casting vote").error(true)
        );

        // Atualizar status da participação para "voted"
        await new Promise((resolve) => {
            mysql.execute(
                "UPDATE participation SET status = 'voted' WHERE id = ?",
                [participationResult.participation.id],
                (err) => {
                    if (err) return response.status(500).json(
                        new apiResponse("Failed to update participation status").error(err)
                    )
                    resolve();
                }
            );
        });

        // Inserir log de auditoria
        await insertAuditLog(user.id, "VOTE_CAST", electionId, candidate_id);

        return response.status(201).json(
            new apiResponse("vote created ").ok(voteInsertResult)
        );

    } catch (error) {
        return response.status(500).json(
            new apiResponse(error.message).error(error)
        );
    }
});

export default router;