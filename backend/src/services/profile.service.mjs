import { ProfileRepository } from "../repositories/profile.repository.mjs";

export class ProfileService {
    static async getProfile(user) {
        try {
            const profileData = await ProfileRepository.findByUserId(user.id);

            if (!profileData) {
                return { success: false, error: "Profile not found" };
            }

            const { username, name, surname, sex, born_date, photo_url } = profileData;

            let profile;
            switch (user.role) {
                case "admin":
                    profile = {
                        username: username,
                        name: name,
                        photo_url: photo_url
                    };
                    break;
                case "eleitor":
                    profile = {
                        username: username,
                        name: name,
                        surname: surname,
                        sex: sex,
                        born_date: born_date,
                        photo_url: photo_url
                    };
                    break;
                default:
                    return { success: false, error: "Invalid role" };
            }

            return { success: true, data: { user: { email: user.email, role: user.role }, profile } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateProfile(userId, updateData) {
        try {
            const allowedFields = ["username", "name", "surname", "photo_url"];

            const filteredData = {};
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            }

            if (Object.keys(filteredData).length === 0) {
                return { success: false, error: "No valid data to update" };
            }

            const result = await ProfileRepository.updateByUserId(userId, filteredData);

            if (!result.modifiedCount) {
                return { success: false, error: "User not found" };
            }

            return { success: true, data: filteredData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}