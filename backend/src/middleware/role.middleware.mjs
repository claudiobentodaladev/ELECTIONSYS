import { apiResponse } from "../utils/response.class.mjs";

export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") return response.status(403).json(
        new apiResponse("access denied, only for admin", request).ok({ role: role })
    );

    next();
};

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") return response.status(403).json(
        new apiResponse("access denied, only for eleitor", request).ok({ role: role })
    );

    next();
};