import { UserRepository } from "../repositories/user.repository.mjs";
import { ProfileRepository } from "../repositories/profile.repository.mjs";
import { PreferencesRepository } from "../repositories/preferences.repository.mjs";
import bcrypt from "bcrypt";

export class AuthService {
    static async register({ user, profile }) {
        try {
            // Check if user already exists
            const existingUser = await UserRepository.findByEmail(user.email);
            if (existingUser.length > 0) {
                return { success: false, error: "User already exists" };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const userData = { ...user, password: hashedPassword };
            const resultUser = await UserRepository.create(userData);

            if (user.role === "eleitor") Object.assign(profile, {
                surname: profile.surname,
                sex: profile.sex,
                born_date: profile.born_date
            });

            const profileData = { ...profile, user_id: resultUser.insertId };
            const resultProfile = await ProfileRepository.create(profileData);

            const resultPreferences = await PreferencesRepository.create(resultUser.insertId)

            const [{ id, email, role, created_at }] = await UserRepository.findById(resultUser.insertId)

            const result = { user: { id, email, role }, profile }

            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async login(email, password) {
        try {
            const users = await UserRepository.findByEmail(email);
            if (users.length === 0) {
                return { success: false, error: "Invalid credentials" };
            }

            const user = users[0];
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return { success: false, error: "Invalid credentials" };
            }

            return { success: true, data: { id: user.id, email: user.email, role: user.role } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getUserById(id) {
        try {
            const users = await UserRepository.findById(id);
            if (users.length === 0) {
                return { success: false, error: "User not found" };
            }
            const user = users[0];
            return { success: true, data: { id: user.id, email: user.email, role: user.role } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateUser(id, data) {
        try {
            if (data.password) {
                data.password_hash = await bcrypt.hash(data.password, 10);
            }

            const result = await UserRepository.update(id, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}