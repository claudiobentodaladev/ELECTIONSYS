export const authenticated = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    }
    return response.status(401).json({
        isAuthenticated: false,
        message: "not authenticated"
    })
}