import { apiResponse } from "../utils/response.class.mjs";

export const errorHandler = (err, request, response, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error ${statusCode}: ${message}`, err.stack);

    response.status(statusCode).json(
        new apiResponse(message, request).error(err)
    );
};