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