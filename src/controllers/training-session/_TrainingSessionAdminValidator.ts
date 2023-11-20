import { ValidatorType } from "../_validators/ValidatorType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateSessionRequest(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "user_ids",
            validationObject: data.user_ids,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "course_uuid",
            validationObject: data.course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "cpt_beisitzer",
            validationObject: data.cpt_beisitzer,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "date",
            validationObject: data.date,
            toValidate: [{ val: ValidationOptions.VALID_DATE }],
        },
        {
            name: "training_type_id",
            validationObject: data.training_type_id,
            toValidate: [{ val: ValidationOptions.NUMBER }],
        },
    ]);
}

function validateUpdateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "date",
            validationObject: data.date,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.VALID_DATE }],
        },
        {
            name: "mentor_id",
            validationObject: data.mentor_id,
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

export default {
    validateCreateSessionRequest,
    validateUpdateRequest,
};
