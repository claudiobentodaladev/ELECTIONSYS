export const isAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== "admin") return response.status(403).json(
        { message: "access denied, only for admin", your_role: role }
    );

    next();
};

export const isEleitor = (request, response, next) => {
    const { role } = request.user;
    if (role !== "eleitor") return response.status(403).json(
        { message: "access denied, only for eleitor", your_role: role }
    );

    next();
};