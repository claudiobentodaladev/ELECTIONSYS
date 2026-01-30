import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { editCandidateSchema } from "../../validator/candidate.schema.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.patch("/:candidate_id", editCandidateSchema, validator, isEleitor, async (request, response) => {
    const { candidate_id } = request.params;
    const { user } = request;
    const { name, description, photo_url } = request.body;

    try {
        // Verify if the candidate exists and belongs to the user
        const candidateResult = await new Promise((resolve) => {
            mysql.execute(
                `SELECT c.id, p.user_id, p.election_id 
                 FROM candidates c 
                 JOIN participation p ON c.participation_id = p.id 
                 WHERE c.id = ?`,
                [candidate_id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else if (result.length === 0) resolve({ success: false, error: "Candidate not found" });
                    else resolve({ success: true, candidate: result[0] });
                }
            );
        });

        if (!candidateResult.success) return response.status(404).json(
            new apiResponse("Candidate not found").error(true)
        );

        if (candidateResult.candidate.user_id !== user.id) return response.status(403).json(
            new apiResponse("You can only edit your own candidate profile").error(true)
        );

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push("group_name = ?");
            values.push(name);
        }
        if (description !== undefined) {
            updates.push("description = ?");
            values.push(description);
        }
        if (photo_url !== undefined) {
            updates.push("logo_group_url = ?");
            values.push(photo_url);
        }

        if (updates.length === 0) return response.status(400).json(
            new apiResponse("No fields to update").error(true));

        // Update candidate
        const updateResult = await new Promise((resolve) => {
            const query = `UPDATE candidates SET ${updates.join(", ")} WHERE id = ?`;
            values.push(candidate_id);
            mysql.execute(query, values, (err, result) => {
                if (err) resolve({ success: false, error: err.message });
                else resolve({ success: true, affectedRows: result.affectedRows, result: result });
            });
        });

        if (!updateResult.success) return response.status(500).json(
            new apiResponse("Error updating candidate").error(true)
        );

        if (updateResult.affectedRows === 0) return response.status(404).json(
            new apiResponse("Candidate not found").error(true)
        );

        return response.status(200).json(
            new apiResponse("Candidate profile updated successfully").ok(updateResult.result)
        );

    } catch (error) {
        console.error("Error editing candidate:", error);
        return response.status(500).json(
            new apiResponse("Internal server error").error(true)
        );
    }
});

export default router;