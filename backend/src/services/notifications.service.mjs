import { NotificationsRepository } from "../repositories/notifications.repository.mjs";

export class NotificationsService {
    static async getNotifications(userId) {
        try {
            const notifications = await NotificationsRepository.getNotifications(userId);
            return { success: true, data: notifications };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}