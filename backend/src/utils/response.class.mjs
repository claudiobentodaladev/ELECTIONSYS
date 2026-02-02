const isAuthenticated = ({ user }) => {
    if (!user) {
        return false
    } else {
        return true
    }
}

export class apiResponse {
    #message;
    #request;
    constructor(message, request) {
        this.#request = request;
        this.#message = message;
    }

    ok(data) {
        return {
            success: true,
            isAuthenticated: isAuthenticated(this.#request),
            message: this.#message || "",
            data: data || {}
        }
    }
    error(data) {
        return {
            success: false,
            isAuthenticated: isAuthenticated(this.#request),
            message: this.#message || "",
            data: data || {}
        }
    }
}