import { apiResponse } from "../utils/response.class.mjs";

export const isAuthenticated = (request, response, next) => {
    if (!request.user) return response.status(401).json(
        new apiResponse("not authenticated").error()
    );
    next();
};