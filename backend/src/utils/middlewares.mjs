import { validationResult } from "express-validator";
import { authResponse, validationResponse } from "./response.class.mjs";

export const isAuthenticated = (request, response, next) => {
    if (!request.user) {
        return response.status(401).json(new authResponse("not authenticated").not());
    }
    next();
};

export const validator = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json(new validationResponse("validation error").error(errors.array()));
    }
    next();
};

export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") {
        return response.status(403).json({ message: "access denied, only for admin", your_role: role });
    }
    next();
};

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") {
        return response.status(403).json({ message: "access denied, only for eleitor", your_role: role });
    }
    next();
};