import { DashboardService } from "../services/dashboard.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class DashboardController {
    static async getDashboard(request, response) {
        const { user } = request;

        const result = await DashboardService.getDashboardStats(user);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Dashboard stats retrieved", request).ok(result.data)
        );
    }
}