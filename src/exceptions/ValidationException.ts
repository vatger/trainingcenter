export class ValidationException extends Error {
    public readonly validation_: object;

    constructor(validation: object) {
        super();
        this.validation_ = validation;
    }

    public getErrorMessages(): object {
        return this.validation_;
    }
}
