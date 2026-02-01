import { ParticipationService } from "../services/participation.service.mjs";
import { apiResponse } from "../utils/response.class.mjs";

export class ParticipationController {
    static async createParticipation(request, response) {
        const { user } = request;
        const { election_id } = request.params;

        const result = await ParticipationService.createParticipation(user.id, election_id);

        if (!result.success) {
            return response.status(400).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(201).json(
            new apiResponse("Participation created", request).ok({ participation_id: result.data.insertId })
        );
    }

    static async getParticipation(request, response) {
        const { user } = request;
        const { election_id } = request.params;

        const result = await ParticipationService.getParticipation(user.id, election_id);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        if (result.data.length === 0) {
            return response.status(404).json(
                new apiResponse("Participation not found", request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Participation retrieved", request).ok(result.data[0])
        );
    }

    static async getAllParticipations(request, response) {
        const { user } = request;

        // For now, simple query
        const result = await ParticipationService.getAllParticipations(user.id);

        if (!result.success) {
            return response.status(500).json(
                new apiResponse(result.error, request).error()
            );
        }

        return response.status(200).json(
            new apiResponse("Participations retrieved", request).ok(result.data)
        );
    }
}