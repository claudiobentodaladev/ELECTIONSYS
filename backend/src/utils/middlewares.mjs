export const authenticated = (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({
            isAuthenticated: false,
            message: "not authenticated"
        })
    }
    next()
}