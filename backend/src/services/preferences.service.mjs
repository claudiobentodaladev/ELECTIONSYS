import { PreferencesRepository } from "../repositories/preferences.repository.mjs";

export class PreferencesService {
    static async switchTheme(userId) {
        try {
            const preferences = await PreferencesRepository.findByUserId(userId);

            if (!preferences) {
                return { success: false, error: "Preferences not found" };
            }

            const currentTheme = preferences.theme;
            let newTheme;

            switch (currentTheme) {
                case "LIGHT":
                    newTheme = "DARK";
                    break;
                case "DARK":
                    newTheme = "LIGHT";
                    break;
                default:
                    return { success: false, error: "Invalid current theme" };
            }

            await PreferencesRepository.updateTheme(userId, newTheme);

            return { success: true, data: { user_id: userId, theme: newTheme } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}