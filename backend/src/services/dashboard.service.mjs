import { DashboardRepository } from "../repositories/dashboard.repository.mjs";

export class DashboardService {
    static async getDashboardStats(user) {
        try {
            if (user.role === "admin") {
                const stats = await DashboardRepository.getAdminStats(user.id);
                return { success: true, data: stats };
            } else {
                // For eleitor, could add different stats
                return { success: true, data: {} };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}