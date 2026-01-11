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
            message: this.#message,
            id: this.#id
        }
    }
}

export class found {
    #found
    #message

    constructor(found, message) {
        this.#found = found
        this.#message = message
    }

    response() {
        return {
            found: this.#found,
            message: this.#message
        }
    }
}