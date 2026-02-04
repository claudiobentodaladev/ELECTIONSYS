import { Router } from "express";
import { isEleitor } from "../../../../middleware/role.middleware.mjs";
import mysql from "../../../../config/database/mysql/db.connection.mjs";
import { apiResponse } from "../../../../utils/response.class.mjs";

const router = Router();

router.patch("/:propose_comentary_id", isEleitor, (request, response) => {
    const { user } = request;
    const { propose_comentary_id } = request.params;
    const { rating, comentary } = request.body;

    // Check if commentary exists and get participation_id
    mysql.execute(
        "SELECT participation_id, candidates_propose_id FROM propose_comentary WHERE id = ?",
        [propose_comentary_id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message || "Database error", request).error(err)
            );
            if (result.length === 0) return response.status(404).json(
                new apiResponse("Commentary not found", request).error({ updated: false })
            );

            const { participation_id, candidates_propose_id } = result[0];

            // Check if the participation belongs to the user
            mysql.execute(
                "SELECT user_id FROM participation WHERE id = ?",
                [participation_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message || "Database error", request).error(err)
                    );
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("Participation not found", request).error({ updated: false})
                    );

                    if (result[0].user_id !== user.id) return response.status(403).json(
                        new apiResponse("You can only edit your own commentaries", request).error({ updated: false })
                    );

                    // Build update query
                    const updates = [];
                    const values = [];

                    if (rating !== undefined) {
                        updates.push("rating = ?");
                        values.push(rating);
                    }
                    if (comentary !== undefined) {
                        updates.push("comentary = ?");
                        values.push(comentary);
                    }

                    if (updates.length === 0) return response.status(400).json(
                        new apiResponse("No fields to update", request).error({ updated: false })
                    );

                    const updateQuery = `UPDATE propose_comentary SET ${updates.join(", ")} WHERE id = ?`;
                    values.push(propose_comentary_id);

                    mysql.execute(updateQuery, values, (err, result) => {
                        if (err) return response.status(500).json(
                            new apiResponse(err.message || "Database error", request).error(err)
                        );
                        if (result.affectedRows === 0) return response.status(404).json(
                            new apiResponse("Update failed", request).error({ updated: false })
                        );

                        return response.status(200).json(
                            new apiResponse("Commentary updated", request).ok({ updated: true })
                        );
                    });
                }
            );
        }
    );
});

export default router;