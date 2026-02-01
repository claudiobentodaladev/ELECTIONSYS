import { ThemeService } from "../services/theme.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class ThemeController {
    static async createTheme(request, response) {
        const { user } = request;
        const { photo_election_url, name, description } = request.body;

        const result = await ThemeService.createTheme(user.id, { photo_election_url, name, description });

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error.message || "Database error", request).error(result.error)
            );
        }

        if (result.data.affectedRows === 0) {
            return response.status(500).json(
                new apiResponse("Theme not inserted", request).error(true)
            );
        }

        return response.status(201).json(
            new apiResponse("Inserted a new theme", request).ok({ photo_election_url, name, description })
        );
    }

    static async getThemes(request, response) {
        const { user } = request;

        const result = await ThemeService.getThemesByUser(user.id);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error.message || "Database error", request).error(result.error)
            );
        }

        if (result.data.length === 0) {
            return response.status(200).json(
                new apiResponse("There's no theme created by this user", request).error(true)
            );
        }

        return response.status(200).json(
            new apiResponse("All themes created by this user", request).ok(result.data)
        );
    }

    static async updateTheme(request, response) {
        const { user } = request;
        const { theme_id } = request.params;
        const { photo_election_url, name, description } = request.body;

        const result = await ThemeService.updateTheme(theme_id, user.id, { photo_election_url, name, description });

        if (!result.success) {
            const status = result.error === "Theme not found or not owned by user" ? 404 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error({ updated: false, message: result.error })
            );
        }

        if (result.data.affectedRows === 0) {
            return response.status(400).json(
                new apiResponse("No fields to update", request).error({ updated: false, message: "no changes!" })
            );
        }

        return response.status(200).json(
            new apiResponse("Theme updated", request).ok({ updated: true, message: "theme updated!" })
        );
    }
}