import { ElectionService } from "../services/election.service.mjs";
import { buildDate, formatDate } from "../utils/data.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class ElectionController {
    static async createElection(request, response) {
        const { user } = request;
        const { theme_id } = request.params;
        const { start_at, end_at } = request.body;

        const startDate = buildDate(start_at);
        const endDate = buildDate(end_at);

        const result = await ElectionService.createElection(user.id, theme_id, formatDate(startDate), formatDate(endDate));

        if (!result.success) {
            return response.status(400).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(201).json(
            new apiResponse("Election created successfully", request).ok({ election_id: result.data.insertId })
        );
    }

    static async getElections(request, response) {
        const { user } = request;
        const { theme_id } = request.params;
        const { election_id } = request.query;

        // For now, delegate to service
        const result = await ElectionService.getElectionsByTheme(theme_id);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Elections retrieved", request).ok(result.data)
        );
    }

    static async updateElection(request, response) {
        const { user } = request;
        const { election_id } = request.params;
        const { start_at, end_at } = request.body;

        const startDate = buildDate(start_at);
        const endDate = buildDate(end_at);

        const result = await ElectionService.updateElection(election_id, user.id, formatDate(startDate), formatDate(endDate));

        if (!result.success) {
            const status = result.error.includes("not found") ? 404 : 400;
            return response.status(status).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Election updated successfully", request).ok()
        );
    }
}