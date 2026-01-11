export class create {
    #created
    #message
    #id

    constructor(created, message, id) {
        this.#created = created
        this.#message = message
        this.#id = id
    }

    response() {
        return {
            created: this.#created,
            message: this.#message
        }
    }
    ok(create) {
        return {
            created: true,
            message: `created the ${create}`,
            id: this.#id
        }
    }
}

export class found {
    #message
    #result

    constructor(message,result) {
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
            error: true,
            message: this.#message
        }
    }

}