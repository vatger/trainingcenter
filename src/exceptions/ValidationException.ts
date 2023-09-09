import { ValidatorType } from "../controllers/_validators/ValidatorType";

export class ValidationException extends Error {
    public readonly validation_: ValidatorType;

    constructor(validation: ValidatorType) {
        super();
        this.validation_ = validation;
    }

    public getErrorMessages(): any[] {
        return this.validation_.message;
    }
}
