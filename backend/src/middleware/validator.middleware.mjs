import { validationResult } from "express-validator";
import { validationResponse } from "../utils/response.class.mjs";

export const validator = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) return response.status(400).json(
        new validationResponse("validation error").error(errors.array())
    );
    next();
};