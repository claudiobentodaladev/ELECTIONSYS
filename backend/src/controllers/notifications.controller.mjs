import { NotificationsService } from "../services/notifications.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class NotificationsController {
    static async getNotifications(request, response) {
        const { user } = request;

        const result = await NotificationsService.getNotifications(user.id);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Notifications retrieved", request).ok(result.data)
        );
    }
}