import { ProfileService } from "../services/profile.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class ProfileController {
    static async getProfile(request, response) {
        const { user } = request;

        const result = await ProfileService.getProfile(user);

        if (!result.success) {
            const status = result.error === "Profile not found" ? 404 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("User data", request).ok(result.data)
        );
    }

    static async updateProfile(request, response) {
        const { user } = request;
        const updateData = request.body;

        const result = await ProfileService.updateProfile(user.id, updateData);

        if (!result.success) {
            const status = result.error === "User not found" ? 404 :
                result.error === "No valid data to update" ? 400 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Profile updated", request).ok(result.data)
        );
    }
}