export class UnauthorizedException extends Error {
    public readonly message_: string;

    constructor(message: string) {
        super();
        this.message_ = message;
    }
}
