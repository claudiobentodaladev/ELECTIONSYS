export class authResponse {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(user) {
        if (this.#message) return {
            isAuthenticated: true,
            message: this.#message,
            user: user
        };
        return {
            isAuthenticated: true,
            message: "user is authenticated!",
            user: user
        };
    }

    not() {
        if (this.#message) return {
            isAuthenticated: false,
            message: this.#message
        };
        return {
            isAuthenticated: false,
            message: "user is not authenticated!"
        };
    }

    error() {
        return {
            isAuthenticated: false,
            message: this.#message,
            error: true
        };
    }
}

export class apiResponse {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(data) {
        return {
            success: true,
            message: this.#message,
            data: data
        }
    }
    error(errors) {
        return {
            success: false,
            message: this.#message,
            error: errors
        }
    }
}