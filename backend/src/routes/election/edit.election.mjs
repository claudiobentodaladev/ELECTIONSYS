import { Router } from "express";
import { election } from "../../validator/election.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { verifyThemeOwnership, validateElectionDates } from "../../utils/sql/sql.helpers.mjs";

const router = Router();

router.patch("/:election_id", election, validator, isAdmin, async (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
    const { start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    // Date validation: do not allow elections in the past
    const electionDate = await validateElectionDates(startDate, endDate);
    if (!electionDate.success) return response.status(400).json(
        new apiResponse(electionDate.message, request).error()
    );

    try {
        // Get election and verify ownership
        const electionResult = await new Promise((resolve) => {
            mysql.execute(
                "SELECT theme_id FROM elections WHERE id = ?",
                [election_id],
                (err, result) => {
                    if (err) resolve({ success: false, error: err.message });
                    else if (result.length === 0) resolve({ success: false, error: "Election not found" });
                    else resolve({ success: true, theme_id: result[0].theme_id });
                }
            );
        });

        if (!electionResult.success) return response.status(404).json(
            new apiResponse(electionResult.error, request).error()
        );

        const { theme_id } = electionResult;

        // Verify if the theme belongs to the user
        const themeResult = await verifyThemeOwnership(theme_id, user.id);
        if (!themeResult.success) return response.status(403).json(
            new apiResponse("You can only edit elections for your own themes", request).error()
        );

        // Check for overlapping elections, excluding the current one
        const overlapResult = await new Promise((resolve) => {
            mysql.execute(
                "SELECT id FROM elections WHERE theme_id = ? AND id != ? AND ((start_at <= ? AND end_at >= ?) OR (start_at <= ? AND end_at >= ?) OR (start_at >= ? AND end_at <= ?))",
                [theme_id, election_id, formatDate(startDate), formatDate(startDate), formatDate(endDate), formatDate(endDate), formatDate(startDate), formatDate(endDate)],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message });
                    else if (result.length > 0) resolve({ success: false, message: "There's already an election overlapping with these dates" });
                    else resolve({ success: true });
                }
            );
        });

        if (!overlapResult.success) return response.status(400).json(
            new apiResponse(overlapResult.message, request).error()
        );

        // Update election
        const updateResult = await new Promise((resolve) => {
            mysql.execute(
                "UPDATE elections SET start_at = ?, end_at = ? WHERE id = ?",
                [formatDate(startDate), formatDate(endDate), election_id],
                (err, result) => {
                    if (err) resolve({ success: false, message: err.message });
                    else if (result.affectedRows === 0) resolve({ success: false, message: "Update failed" });
                    else resolve({ success: true });
                }
            );
        });

        if (!updateResult.success) return response.status(500).json(
            new apiResponse(updateResult.message, request).error()
        );

        return response.status(200).json(
            new apiResponse("Election updated successfully", request).ok({ updated: true })
        );

    } catch (err) {
        return response.status(500).json(
            new apiResponse(err.message, request).error(err)
        );
    }
});

export default router;