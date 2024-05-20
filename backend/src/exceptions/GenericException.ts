export class GenericException extends Error {
    public readonly code_: string;
    public readonly message_: string;

    constructor(code: string, message: string) {
        super();
        this.code_ = code;
        this.message_ = message;
    }

    public getCode() {
        return this.code_;
    }

    public getMessage() {
        return this.message_;
    }
}