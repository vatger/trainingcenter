export class ForbiddenException extends Error {
    public readonly error_: string;

    constructor(error: string) {
        super();
        this.error_ = error;
    }
}
