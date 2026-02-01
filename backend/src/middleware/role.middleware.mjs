import { apiResponse } from "../utils/response.class.mjs";

export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") return response.status(403).json(
        new apiResponse(request, "access denied, only for admin").ok({ role: role })
    );

    next();
};

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") return response.status(403).json(
        new apiResponse(request, "access denied, only for eleitor").ok({ role: role })
    );

    next();
};