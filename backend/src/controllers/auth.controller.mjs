import { AuthService } from "../services/auth.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class AuthController {
    static async register(request, response) {
        const { user, profile } = request.body;

        const result = await AuthService.register({ user, profile });

        if (!result.success) {
            return response.status(400).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(201).json(
            new apiResponse("User registered successfully", request).ok(result.data)
        );
    }

    static async login(request, response) {
        const { email, password } = request.body;

        const result = await AuthService.login(email, password);

        if (!result.success) {
            return response.status(401).json(
                new apiResponse(result.error, request).error()
            );
        }

        request.logIn(result.data, (err) => {
            if (err) {
                return response.status(500).json(
                    new apiResponse("Login failed", request).error()
                );
            }
            return response.status(200).json(
                new apiResponse("Login successful", request).ok({ user: result.data })
            );
        });
    }

    static async logout(request, response) {

        const { id, role } = request.user;
        const user = { id, role }

        request.logout((err) => {
            if (err) {
                return response.status(500).json(
                    new apiResponse("Logout failed", request).error()
                );
            }
            return response.status(200).json(
                new apiResponse("Logout successful", request).ok(user)
            );
        });
    }

    static async getStatus(request, response) {
        const { user } = request;

        const result = await AuthService.getUserById(user.id);

        if (!result.success) {
            return response.status(404).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("User status", request).ok(result.data)
        );
    }

    static async updatePassword(request, response) {
        const { user } = request;
        const { current_password, new_password } = request.body;

        // Verify current password
        const loginResult = await AuthService.login(user.email, current_password);
        if (!loginResult.success) {
            return response.status(401).json(
                new apiResponse("Current password is incorrect", request).error()
            );
        }

        const result = await AuthService.updateUser(user.id, { password: new_password });

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Password updated", request).ok()
        );
    }

    static async updateProfile(request, response) {
        const { user } = request;
        const { name, email, photo_url } = request.body;

        const result = await AuthService.updateUser(user.id, { name, email, photo_url });

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Profile updated", request).ok()
        );
    }
}