import { VoteRepository } from "../repositories/vote.repository.mjs";
import { checkElectionEligibility, getUserParticipation, insertAuditLog } from "../utils/sql/sql.helpers.mjs";

export class VoteService {
    static async createVote(userId, candidateId) {
        try {
            // Verify if the candidate exists and get participation_id
            const participationId = await VoteRepository.getCandidateParticipation(candidateId);

            // Get election_id from participation
            const electionId = await VoteRepository.getElectionFromParticipation(participationId);

            // Verify user participation
            const participationResult = await getUserParticipation(userId, electionId);
            if (!participationResult.success) {
                return { success: false, error: "User has not participated in this election" };
            }

            // Verify if the election allows votes
            const eligibilityResult = await checkElectionEligibility(electionId, 'vote');
            if (!eligibilityResult.success) {
                return { success: false, error: "Error checking election status" };
            }

            if (eligibilityResult.status !== 'ongoing') {
                return { success: false, error: `Cannot vote: election is ${eligibilityResult.status}` };
            }

            // Verify if the user has already voted
            const hasVoted = await VoteRepository.checkExistingVote(participationResult.participation.id);
            if (hasVoted) {
                return { success: false, error: "User has already voted in this election" };
            }

            // Insert vote
            const voteResult = await VoteRepository.create(participationResult.participation.id, candidateId);

            // Update participation status to "voted"
            await VoteRepository.updateParticipationStatus(participationResult.participation.id, 'voted');

            // Insert audit log
            await insertAuditLog(userId, "VOTE_CAST", electionId, candidateId);

            return { success: true, data: voteResult };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async getVotes(user, electionId) {
        try {
            const result = await VoteRepository.findByElectionAndUser(user, electionId);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}