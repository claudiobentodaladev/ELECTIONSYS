import { validationResult } from "express-validator";
export const authenticated = (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({
            isAuthenticated: false,
            message: "not authenticated"
        })
    }
    next()
}

export const validator = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({
            message: "validation error",
            error: errors.array()
        })
    }
    next()
}

export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") {
        return response.status(403).json({ message: "acess denied, only for admin", your_role: role })
    }
    next()
}

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") {
        return response.status(403).json({ message: "acess denied, only for eleitor", your_role: role })
    }
    next()
}