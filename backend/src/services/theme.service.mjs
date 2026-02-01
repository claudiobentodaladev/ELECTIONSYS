import { ThemeRepository } from "../repositories/theme.repository.mjs";

export class ThemeService {
    static async createTheme(userId, data) {
        try {
            const result = await ThemeRepository.create(userId, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    }

    static async getThemesByUser(userId) {
        try {
            const themes = await ThemeRepository.findByUserId(userId);
            return { success: true, data: themes };
        } catch (error) {
            return { success: false, error };
        }
    }

    static async updateTheme(id, userId, data) {
        try {
            // Check if theme exists and belongs to user
            const theme = await ThemeRepository.findByIdAndUserId(id, userId);
            if (theme.length === 0) {
                return { success: false, error: "Theme not found or not owned by user" };
            }

            const result = await ThemeRepository.update(id, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    }
}