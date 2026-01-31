import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { getUserParticipation } from "../../utils/sql/sql.helpers.mjs";

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
                            if (err) resolve({ success: false, message: err.message, error: err });
                            else if (result.length === 0) resolve({ success: false, message: "No themes created by this user", error: true });
                            else resolve({ success: true, themeIds: joinedArray(result) });
                        }
                    );
                });

                if (!themeResult.success) {
                    return response.status(404).json(
                        new apiResponse(themeResult.message).error(themeResult.error)
                    );
                }

                // Verify if the election belongs to one of the admin's themes
                const electionCheck = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM elections WHERE id = ? AND theme_id IN (?)",
                        [election_id, themeResult.themeIds],
                        (err, result) => {
                            if (err) resolve({ success: false, message: err.message, error: err });
                            else if (result.length === 0) resolve({ success: false, message: "Election not found or not owned", error: true });
                            else resolve({ success: true, electionId: result[0].id });
                        }
                    );
                });

                if (!electionCheck.success) {
                    return response.status(404).json(
                        new apiResponse(electionCheck.message).error(electionCheck.error)
                    );
                }

                // Get all participations of the election
                const participationsResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM participation WHERE election_id = ?",
                        [electionCheck.electionId],
                        (err, result) => {
                            if (err) resolve({ success: false, message: err.message, error: err, statusCode: 500 });
                            else if (result.length === 0) resolve({ success: false, message: "No votes found", error: true, statusCode: 404 });
                            else resolve({ success: true, participationIds: joinedArray(result) });
                        }
                    );
                });

                if (!participationsResult.success) {
                    return response.status(participationsResult.statusCode).json(
                        new apiResponse(participationsResult.message).error(participationsResult.error)
                    );
                }

                // Get all votes
                const votesResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT * FROM vote WHERE participation_id IN (?)",
                        [participationsResult.participationIds],
                        (err, result) => {
                            if (err) resolve({ success: false, error: err.message, error: err, statusCode: 500 });
                            else if (result.length === 0) resolve({ success: false, message: "No votes found", error: true, statusCode: 404 });
                            else resolve({ success: true, message: "all the vote", votes: result, statusCode: 200 });
                        }
                    );
                });

                if (!votesResult.success) {
                    return response.status(votesResult.statusCode).json(
                        new apiResponse(votesResult.message).error(votesResult.error)
                    );
                }

                return response.status(votesResult.statusCode).json(
                    new apiResponse(votesResult.message).ok(votesResult.votes)
                );

            case "eleitor":
                // Verify voter's participation in the election
                const { success, message, statusCode, error, participation } = await getUserParticipation(user.id, election_id);
                if (!success) {
                    return response.status(statusCode).json(
                        new apiResponse(message).error(error)
                    );
                }

                // Get user's votes
                const userVotesResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT * FROM vote WHERE participation_id = ?",
                        [participation.id],
                        (err, result) => {
                            if (err) resolve({ success: false, message: err.message, error: err, statusCode: 500 });
                            else if (result.length === 0) resolve({ success: false, message: "No votes found", error: true, statusCode: 404 });
                            else resolve({ success: true, message: "all the vote",statusCode: 200, votes: result });
                        }
                    );
                });

                if (!userVotesResult.success) {
                    return response.status(userVotesResult.statusCode).json(
                        new apiResponse(userVotesResult.message).error(userVotesResult.error)
                    );
                }

                return response.status(userVotesResult.statusCode).json(
                    new found(userVotesResult.message).ok(userVotesResult.votes)
                );

            default:
                return response.status(400).json(
                    new found("Invalid user role").error(true)
                );
        }
    } catch (error) {
        console.error("Error getting votes:", error);
        return response.status(500).json(
            new apiResponse("Internal server error").error(true)
        );
    }
});

export default router;