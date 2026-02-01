import { ElectionRepository } from "../repositories/election.repository.mjs";
import { verifyThemeOwnership, validateElectionDates } from "../utils/sql/sql.helpers.mjs";

export class ElectionService {
    static async createElection(userId, themeId, startDate, endDate) {
        try {
            // Validate dates
            const dateValidation = await validateElectionDates(startDate, endDate);
            if (!dateValidation.success) {
                return { success: false, error: dateValidation.message };
            }

            // Verify theme ownership
            const themeResult = await verifyThemeOwnership(themeId, userId);
            if (!themeResult.success) {
                return { success: false, error: "Theme not found or not owned by user" };
            }

            // Check for overlapping elections
            const overlapping = await ElectionRepository.findOverlapping(themeId, startDate, endDate);
            if (overlapping.length > 0) {
                return { success: false, error: "There's already an election overlapping with these dates" };
            }

            const result = await ElectionRepository.create(themeId, startDate, endDate);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getElectionsByTheme(themeId) {
        try {
            const elections = await ElectionRepository.findByThemeId(themeId);
            return { success: true, data: elections };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateElection(id, userId, startDate, endDate) {
        try {
            // Validate dates
            const dateValidation = await validateElectionDates(startDate, endDate);
            if (!dateValidation.success) {
                return { success: false, error: dateValidation.message };
            }

            // Get election to check theme ownership
            const election = await ElectionRepository.findById(id);
            if (election.length === 0) {
                return { success: false, error: "Election not found" };
            }

            const themeId = election[0].theme_id;

            // Verify theme ownership
            const themeResult = await verifyThemeOwnership(themeId, userId);
            if (!themeResult.success) {
                return { success: false, error: "You can only edit elections for your own themes" };
            }

            // Check for overlapping elections, excluding current
            const overlapping = await ElectionRepository.findOverlapping(themeId, startDate, endDate, id);
            if (overlapping.length > 0) {
                return { success: false, error: "There's already an election overlapping with these dates" };
            }

            const result = await ElectionRepository.update(id, startDate, endDate);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}