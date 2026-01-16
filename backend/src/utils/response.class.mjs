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

    ok(review) {
        return {
            reviewed: true,
            message: `Reviewed the ${review}`
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

export class authResponse {
    #message
    constructor(message) {
        this.#message = message;
    }

    ok(user) {
        return {
            authenticated: true,
            message: "authenticated",
            user: user
        };
    }

    not() {
        return {
            authenticated: false,
            message: this.#message
        };
    }

    error() {
        return {
            authenticated: false,
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