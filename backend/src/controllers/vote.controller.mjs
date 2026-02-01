import { VoteService } from "../services/vote.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class VoteController {
    static async createVote(request, response) {
        const { user } = request;
        const { candidate_id } = request.params;

        const result = await VoteService.createVote(user.id, candidate_id);

        if (!result.success) {
            const status = result.error.includes("not participated") ? 404 :
                result.error.includes("already voted") || result.error.includes("Cannot vote") ? 403 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(201).json(
            new apiResponse("Vote created", request).ok({ vote_id: result.data.insertId })
        );
    }

    static async getVotes(request, response) {
        const { user } = request;
        const { election_id } = request.params;

        const result = await VoteService.getVotes(user, election_id);

        if (!result.success) {
            const status = result.error.includes("not found") ? 404 :
                result.error.includes("not participated") ? 403 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Votes retrieved", request).ok(result.data)
        );
    }
}