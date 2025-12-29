export const authenticated = (request, response, next) => {
    if (!request.user) {
        return response.status(401).send("NOT AUTHENTICATED!")
    }
    next();
}