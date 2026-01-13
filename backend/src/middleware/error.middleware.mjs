export const errorHandler = (err, request, response, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error ${statusCode}: ${message}`, err.stack);

    const isProduction = process.env.NODE_ENV === 'production';
    const errorResponse = {
        success: false,
        message: message
    };

    if (!isProduction) {
        errorResponse.stack = err.stack;
    }

    response.status(statusCode).json(errorResponse);
};