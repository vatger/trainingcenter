import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "solo_duration",
            validationObject: data.solo_duration,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "endorsement_group_id",
            validationObject: data.endorsement_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "solo_start",
            validationObject: data.solo_start,
            toValidate: [{ val: ValidationOptions.VALID_DATE }],
        },
        {
            name: "trainee_id",
            validationObject: data.trainee_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

function validateUpdateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "solo_duration",
            validationObject: data.solo_duration,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "solo_start",
            validationObject: data.solo_start,
            toValidate: [{ val: ValidationOptions.VALID_DATE }],
        },
        {
            name: "trainee_id",
            validationObject: data.trainee_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

function validateExtensionRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "trainee_id",
            validationObject: data.trainee_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

export default {
    validateCreateRequest,
    validateUpdateRequest,
    validateExtensionRequest,
};
