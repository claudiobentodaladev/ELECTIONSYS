import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { found } from "../../utils/response.class.mjs";
import { autoUpdateElectionStatus } from "../../utils/middlewares.mjs";
import { verifyThemeOwnership, getUserParticipation } from "../../utils/sql/sql.helpers.mjs";

const router = Router()

router.get("/:election_id", autoUpdateElectionStatus, async (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    try {
        switch (user.role) {
            case "admin":
                // Verify if the admin has themes
                const themeResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM theme WHERE user_id = ?",
                        [user.id],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message });
                            else if (result.length === 0) resolve({ success: false, error: "No themes found" });
                            else resolve({ success: true, themeIds: joinedArray(result) });
                        }
                    );
                });

                if (!themeResult.success) {
                    return response.status(404).json(new found("No themes created by this user").not());
                }

                // Verify if the election belongs to one of the admin's themes
                const electionCheck = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM elections WHERE id = ? AND theme_id IN (?)",
                        [election_id, themeResult.themeIds],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message });
                            else if (result.length === 0) resolve({ success: false, error: "Election not found or not owned" });
                            else resolve({ success: true, electionId: result[0].id });
                        }
                    );
                });

                if (!electionCheck.success) {
                    return response.status(404).json(new found("Election not found").not());
                }

                // Get all participations of the election
                const participationsResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM participation WHERE election_id = ?",
                        [electionCheck.electionId],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message });
                            else resolve({ success: true, participationIds: joinedArray(result) });
                        }
                    );
                });

                if (!participationsResult.success || participationsResult.participationIds.length === 0) {
                    return response.status(404).json(new found("No votes found").not());
                }

                // Get all votes
                const votesResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT * FROM vote WHERE participation_id IN (?)",
                        [participationsResult.participationIds],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message });
                            else resolve({ success: true, votes: result });
                        }
                    );
                });

                if (!votesResult.success || votesResult.votes.length === 0) {
                    return response.status(404).json(new found("No votes found").not());
                }

                return response.status(200).json(new found(null, votesResult.votes).ok("votes"));

            case "eleitor":
                // Verify voter's participation in the election
                const participationResult = await getUserParticipation(user.id, election_id);
                if (!participationResult.success) {
                    return response.status(404).json(new found("User has not participated in this election").not());
                }

                // Get user's votes
                const userVotesResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT * FROM vote WHERE participation_id = ?",
                        [participationResult.participation.id],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message });
                            else resolve({ success: true, votes: result });
                        }
                    );
                });

                if (!userVotesResult.success || userVotesResult.votes.length === 0) {
                    return response.status(404).json(new found("No votes found").not());
                }

                return response.status(200).json(new found(null, userVotesResult.votes).ok("votes"));

            default:
                return response.status(500).json(new found("Invalid user role").error());
        }
    } catch (error) {
        console.error("Error getting votes:", error);
        return response.status(500).json(new found("Internal server error").error());
    }
});

export default router;