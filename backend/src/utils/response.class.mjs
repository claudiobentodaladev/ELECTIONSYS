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
    not() {
        return {
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

    ok() {
        return {
            found: true,
            message: this.#message,
            result: this.#result
        }
    }

    not() {
        return {
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

    not() {
        return {
            reviewed: false,
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