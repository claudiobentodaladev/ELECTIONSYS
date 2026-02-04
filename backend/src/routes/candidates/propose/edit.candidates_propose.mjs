import { Router } from "express";
import { isEleitor } from "../../../middleware/role.middleware.mjs";
import mysql from "../../../config/database/mysql/db.connection.mjs";
import { apiResponse } from "../../../utils/response.class.mjs";

const router = Router();

router.patch("/:candidates_propose_id", isEleitor, (request, response) => {
    const { candidates_propose_id } = request.params;
    const { user } = request;
    const { title, body } = request.body;

    // Check if candidates_propose exists and get candidate_id
    mysql.execute(
        "SELECT candidate_id FROM candidates_propose WHERE id = ?",
        [candidates_propose_id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message || "Database error", request).error(err)
            );
            if (result.length === 0) return response.status(404).json(
                new apiResponse("Candidate propose not found", request).error({ updated: false })
            );

            const { candidate_id } = result[0];

            // Check if the candidate belongs to the user
            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message || "Database error", request).error(err)
                    );
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("Candidate not found", request).error({ updated: false })
                    );

                    const { participation_id } = result[0];

                    mysql.execute(
                        "SELECT user_id FROM participation WHERE id = ?",
                        [participation_id], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message || "Database error", request).error(err)
                            );
                            if (result.length === 0) return response.status(404).json(
                                new apiResponse("Participation not found", request).error({ updated: false })
                            );

                            if (result[0].user_id !== user.id) return response.status(403).json(
                                new apiResponse("You can only edit your own candidate proposals", request).error({ updated: false })
                            );

                            // Build update query
                            const updates = [];
                            const values = [];

                            if (title !== undefined) {
                                updates.push("title = ?");
                                values.push(title);
                            }
                            if (body !== undefined) {
                                updates.push("body = ?");
                                values.push(body);
                            }

                            if (updates.length === 0) return response.status(400).json(
                                new apiResponse("No fields to update", request).error({ updated: false })
                            );

                            const updateQuery = `UPDATE candidates_propose SET ${updates.join(", ")} WHERE id = ?`;
                            values.push(candidates_propose_id);

                            mysql.execute(updateQuery, values, (err, result) => {
                                if (err) return response.status(500).json(
                                    new apiResponse(err.message || "Database error", request).error(err)
                                );
                                if (result.affectedRows === 0) return response.status(404).json(
                                    new apiResponse("Update failed", request).error({ updated: false })
                                );

                                return response.status(200).json(
                                    new apiResponse("Candidate propose updated", request).ok({ updated: true })
                                );
                            });
                        }
                    );
                }
            );
        }
    );
});

export default router;