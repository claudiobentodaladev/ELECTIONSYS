import { CandidateService } from "../services/candidate.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class CandidateController {
    static async createCandidate(request, response) {
        const { user } = request;
        const { election_id } = request.params;
        const { logo_group_url, group_name, description } = request.body;

        const result = await CandidateService.createCandidate(user.id, election_id, { logo_group_url, group_name, description });

        if (!result.success) {
            const status = result.error.includes("not eligible") || result.error.includes("already voted") ? 403 :
                result.error.includes("not found") ? 404 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(201).json(
            new apiResponse("Candidate created", request).ok({ candidate_id: result.data.insertId })
        );
    }

    static async getCandidates(request, response) {
        const { user } = request;
        const { election_id } = request.params;

        const result = await CandidateService.getCandidates(user, election_id);

        if (!result.success) {
            const status = result.error.includes("not found") ? 404 :
                result.error.includes("not participating") ? 403 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Candidates retrieved", request).ok(result.data)
        );
    }

    static async updateCandidate(request, response) {
        const { user } = request;
        const { candidate_id } = request.params;
        const { group_name, description, logo_group_url } = request.body;

        const result = await CandidateService.updateCandidate(user.id, candidate_id, { group_name, description, logo_group_url });

        if (!result.success) {
            const status = result.error.includes("not found") ? 404 :
                result.error.includes("not your candidate") ? 403 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Candidate updated", request).ok()
        );
    }

    static async reviewCandidate(request, response) {
        const { user } = request;
        const { candidate_id } = request.params;
        const { status_candidate } = request.body;

        const result = await CandidateService.reviewCandidate(user.id, candidate_id, status_candidate);

        if (!result.success) {
            const status = result.error.includes("not found") ? 404 :
                result.error.includes("not authorized") ? 403 : 500;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse(`Candidate reviewed to ${status_candidate}`, request).ok()
        );
    }
}