export class create {
    #message
    #id

    constructor(message, id) {
        this.#message = message
        this.#id = id
    }

    ok(create) {
        return {
            created: true,
            message: `created the ${create}`,
            id: this.#id
        }
    }
    not(create) {
        if (create) return {
            created: false,
            message: `${create} not created`
        }
        else return {
            created: false,
            message: this.#message
        }
    }

    error() {
        return {
            created: false,
            message: this.#message,
            error: true
        }
    }
}

export class found {
    #message
    #result

    constructor(message, result) {
        this.#message = message
        this.#result = result
    }

    ok(found) {
        return {
            found: true,
            message: `found ${found}`,
            result: this.#result
        }
    }

    not(found) {
        if (found) return {
            found: false,
            message: `${found} not found`
        }
        else return {
            found: false,
            message: this.#message
        }
    }

    error() {
        return {
            found: false,
            message: this.#message,
            error: true
        }
    }

}

export class review {
    #message

    constructor(message) {
        this.#message = message
    }

    ok(review, to) {
        if (to) {
            return {
                reviewed: true,
                message: `Reviewed the ${review}`,
                to: to
            }
        }
        return {
            reviewed: true,
            message: `Reviewed the ${review}`,
        }
    }

    not(review) {
        if (review) return {
            found: false,
            message: `${found} not found`
        }
        else return {
            found: false,
            message: this.#message
        }
    }

    error() {
        return {
            reviewed: false,
            message: this.#message,
            error: true
        }
    }

}

export class signUser {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(user) {
        return {
            signed: true,
            message: "created user account",
            user: user
        }
    }
    not() {
        return {
            signed: false,
            message: this.#message
        }
    }
    error() {
        return {
            signed: false,
            message: this.#message,
            error: true
        }
    }
}

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

export class logOutUser {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(user) {
        return {
            isAuthenticated: false,
            message: "user is logged out!",
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
            message: "user is not logged out!"
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

export class validationResponse {
    #message
    constructor(message) {
        this.#message = message;
    }

    error(errors) {
        return {
            valid: false,
            message: this.#message,
            errors: errors
        };
    }
}

export class profileResponse {
    ok(profileData) {
        return {
            success: true,
            message: "profile retrieved",
            data: profileData
        }
    }
    error(message) {
        return {
            success: false,
            message: message,
            error: true
        }
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
    error() {
        return {
            success: false,
            message: this.#message,
            error: true
        }
    }
}