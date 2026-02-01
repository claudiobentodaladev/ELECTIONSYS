export class authResponse {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(user) {
        return {
            isAuthenticated: true,
            message: this.#message,
            user: user,
            error: false
        };
    }

    not() {
        return {
            isAuthenticated: false,
            message: this.#message,
            user: {},
            error: false
        };
    }

    error() {
        return {
            isAuthenticated: false,
            message: this.#message,
            user: {},
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