import { CandidateRepository } from "../repositories/candidate.repository.mjs";
import { checkElectionEligibility, getUserParticipation } from "../utils/sql/sql.helpers.mjs";

export class CandidateService {
    static async createCandidate(userId, electionId, data) {
        try {
            // Verify user participation
            const participationResult = await getUserParticipation(userId, electionId);
            if (!participationResult.success) {
                return { success: false, error: "There's no participation with this user" };
            }

            const { status } = participationResult.participation;

            if (status === "ineligible") {
                return { success: false, error: "This user is not eligible to be a candidate" };
            }

            if (status === "voted") {
                return { success: false, error: "This user already voted, not available to be a candidate" };
            }

            // Verify if the election allows candidacies
            const eligibilityResult = await checkElectionEligibility(electionId, 'candidacy');
            if (!eligibilityResult.success) {
                return { success: false, error: "Error checking election status" };
            }

            if (!eligibilityResult.canParticipate) {
                return { success: false, error: `Cannot create candidacy: election is ${eligibilityResult.status}` };
            }

            const result = await CandidateRepository.create(participationResult.participation.id, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getCandidates(user, electionId) {
        try {
            const result = await CandidateRepository.findByElectionAndUser(user, electionId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async updateCandidate(userId, candidateId, data) {
        try {
            // Verify if the candidate exists and belongs to the user
            const candidate = await CandidateRepository.findById(candidateId);
            if (candidate.length === 0) {
                return { success: false, error: "Candidate not found" };
            }

            // Check ownership via participation
            const ownershipCheck = await CandidateRepository.checkOwnership(candidateId, userId);
            if (!ownershipCheck) {
                return { success: false, error: "You can only edit your own candidate profile" };
            }

            const result = await CandidateRepository.update(candidateId, data);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async reviewCandidate(adminId, candidateId, status) {
        try {
            // Check if admin owns the theme for this candidate's election
            const authCheck = await CandidateRepository.checkAdminAuthorization(adminId, candidateId);
            if (!authCheck) {
                return { success: false, error: "Not authorized to review this candidate" };
            }

            const result = await CandidateRepository.updateStatus(candidateId, status);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}