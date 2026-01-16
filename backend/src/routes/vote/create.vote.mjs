import { Router } from "express";
import { isEleitor, autoUpdateElectionStatus } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { create } from "../../utils/response.class.mjs";
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
            return response.status(404).json(new create("Candidate not found").not());
        }

        // Get election_id from participation
        const electionResult = await new Promise((resolve) => {
            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [candidateResult.participationId],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else if (result.length === 0) resolve({ success: false, error: "Election not found" });
                    else resolve({ success: true, electionId: result[0].election_id });
                }
            );
        });

        if (!electionResult.success) {
            return response.status(404).json(new create("Election not found").not());
        }

        const electionId = electionResult.electionId;

        // Verify user participation
        const participationResult = await getUserParticipation(user.id, electionId);
        if (!participationResult.success) {
            return response.status(404).json(new create("User has not participated in this election").not());
        }

        // Verify if the election allows votes
        const eligibilityResult = await checkElectionEligibility(electionId, 'vote');
        if (!eligibilityResult.success) {
            return response.status(500).json(new create("Error checking election status").error());
        }

        if (eligibilityResult.status !== 'ongoing') {
            return response.status(403).json(new create(`Cannot vote: election is ${eligibilityResult.status}`).not());
        }

        // Verify if the user has already voted
        const existingVote = await new Promise((resolve) => {
            mysql.execute(
                "SELECT id FROM vote WHERE participation_id = ?",
                [participationResult.participation.id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, hasVoted: result.length > 0 });
                }
            );
        });

        if (!existingVote.success) return response.status(500).json(new create("Error checking existing votes").error());

        if (existingVote.hasVoted) return response.status(403).json(new create("User has already voted in this election").not());

        // Inserir voto
        const voteInsertResult = await new Promise((resolve) => {
            mysql.execute(
                "INSERT INTO vote VALUES (default,?,?,default)",
                [participationResult.participation.id, candidate_id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else resolve({ success: true, insertId: result.insertId });
                }
            );
        });

        if (!voteInsertResult.success) return response.status(500).json(new create("Error casting vote").error());

        // Atualizar status da participação para "voted"
        await new Promise((resolve) => {
            mysql.execute(
                "UPDATE participation SET status = 'voted' WHERE id = ?",
                [participationResult.participation.id],
                (err) => {
                    if (err) console.error("Failed to update participation status:", err);
                    resolve();
                }
            );
        });

        // Inserir log de auditoria
        await insertAuditLog(user.id, "VOTE_CAST", electionId, candidate_id);

        return response.status(201).json(new create("vote", voteInsertResult.insertId).ok());

    } catch (error) {
        console.error("Error casting vote:", error);
        return response.status(500).json(new create("vote").error());
    }
});

export default router;