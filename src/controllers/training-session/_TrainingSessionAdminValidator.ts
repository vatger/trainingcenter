import { ValidatorType } from "../_validators/ValidatorType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

function validateCreateSessionRequest(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "user_ids",
            validationObject: data.user_ids,
            toValidate: [{ val: ValidationOptions.NON_NULL }]
        },
        {
            name: "course_uuid",
            validationObject: data.course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }]
        },
        {
            name: "date",
            validationObject: data.date,
            toValidate: [{ val: ValidationOptions.VALID_DATE }]
        },
        {
            name: "training_type_id",
            validationObject: data.training_type_id,
            toValidate: [{ val: ValidationOptions.NUMBER }]
        }
    ])
}

export default {
    validateCreateSessionRequest
}