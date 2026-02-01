export class apiResponse {
    #message
    constructor(message) {
        this.#message = message;
    }
    
    ok(data) {
        return {
            success: true,
            isAuthenticated: undefined,// need a real logic in response auth status
            message: this.#message,
            data: data,
            error: false
        }
    }
    error(data) {
        return {
            success: false,
            isAuthenticated: undefined,// need a real logic in response auth status
            message: this.#message,
            data: data,
            error: true
        }
    }
}