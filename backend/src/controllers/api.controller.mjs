import { apiResponse } from "../utils/response.class.mjs";

export class APIController {
    static async getAPIStatus(request, response) {
        return response.status(200).json(
            new apiResponse("API is working!", request).ok()
        )
    }
}