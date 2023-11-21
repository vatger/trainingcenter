import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "date",
            validationObject: data.date,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.VALID_DATE }],
        },
        {
            name: "trainee_id",
            validationObject: data.trainee_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "course_id",
            validationObject: data.course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "training_type_id",
            validationObject: data.training_type_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "training_station_id",
            validationObject: data.training_station_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

function validateAddMentorRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "training_session_id",
            validationObject: data.training_session_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

function validateRemoveMentorRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "training_session_id",
            validationObject: data.training_session_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

export default {
    validateCreateRequest,
    validateAddMentorRequest,
    validateRemoveMentorRequest,
};
