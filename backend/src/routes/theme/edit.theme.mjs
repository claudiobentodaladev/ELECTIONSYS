import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { themeSchema } from "../../validator/theme.schema.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.patch("/:theme_id", isAdmin, themeSchema, validator, (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { photo_url, title, description } = request.body;

    // Check if theme exists and belongs to the user
    mysql.execute(
        "SELECT id FROM theme WHERE id = ? AND user_id = ?",
        [theme_id, user.id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message || "Database error", request).error(err)
            );
            if (result.length === 0) return response.status(404).json(
                new apiResponse("Theme not found or not owned by user", request).error({ updated: false, message: "not found!" })
            );

            // Build update query
            const updates = [];
            const values = [];

            if (photo_url !== undefined) {
                updates.push("photo_url = ?");
                values.push(photo_url);
            }
            if (title !== undefined) {
                updates.push("title = ?");
                values.push(title);
            }
            if (description !== undefined) {
                updates.push("description = ?");
                values.push(description);
            }

            if (updates.length === 0) return response.status(400).json(
                new apiResponse("No fields to update", request).error({ updated: false, message: "no changes!" })
            );

            const updateQuery = `UPDATE theme SET ${updates.join(", ")} WHERE id = ?`;
            values.push(theme_id);

            mysql.execute(updateQuery, values, (err, result) => {
                if (err) return response.status(500).json(
                    new apiResponse(err.message || "Database error", request).error(err)
                );
                if (result.affectedRows === 0) return response.status(404).json(
                    new apiResponse("Update failed", request).error({ updated: false, message: "not updated!" })
                );

                return response.status(200).json(
                    new apiResponse("Theme updated", request).ok({ updated: true, message: "theme updated!" })
                );
            });
        }
    );
});

export default router;
