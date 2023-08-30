import { ValidatorType } from "../_validators/ValidatorType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

function validateUpdateOrCreateRequest(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "course_uuid",
            validationObject: data.course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "name_de",
            validationObject: data.name_de,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "name_en",
            validationObject: data.name_en,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "description_de",
            validationObject: data.description_de,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "description_en",
            validationObject: data.description_en,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "self_enrol_enabled",
            validationObject: data.self_enrol_enabled,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "active",
            validationObject: data.active,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "training_type_id",
            validationObject: data.training_type_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);
}

export default {
    validateUpdateOrCreateRequest,
};
