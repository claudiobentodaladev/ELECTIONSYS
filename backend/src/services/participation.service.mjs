import { ParticipationRepository } from "../repositories/participation.repository.mjs";

export class ParticipationService {
    static async createParticipation(userId, electionId) {
        try {
            // Check if already participated
            const existing = await ParticipationRepository.findByUserAndElection(userId, electionId);
            if (existing.length > 0) {
                return { success: false, error: "Already participated in this election" };
            }

            const result = await ParticipationRepository.create(userId, electionId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getParticipation(userId, electionId) {
        try {
            const participation = await ParticipationRepository.findByUserAndElection(userId, electionId);
            return { success: true, data: participation };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getAllParticipations(userId) {
        try {
            const participations = await ParticipationRepository.findByUserId(userId);
            return { success: true, data: participations };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}