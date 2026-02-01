import { PreferencesService } from "../services/preferences.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class PreferencesController {
    static async switchTheme(request, response) {
        const { user } = request;

        const result = await PreferencesService.switchTheme(user.id);

        if (!result.success) {
            const status = result.error === "Preferences not found" ? 404 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Theme switched", request).ok(result.data)
        );
    }
}