import { UserRepository } from "../repositories/user.repository.mjs";
import bcrypt from "bcrypt";

export class AuthService {
    static async register(data) {
        try {
            // Check if user already exists
            const existingUser = await UserRepository.findByEmail(data.email);
            if (existingUser.length > 0) {
                return { success: false, error: "User already exists" };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userData = { ...data, password: hashedPassword };

            const result = await UserRepository.create(userData);
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

            return { success: true, data: { id: user.id, email: user.email, password: user.password, role: user.role } };
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
                data.password = await bcrypt.hash(data.password, 10);
            }

            const result = await UserRepository.update(id, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}