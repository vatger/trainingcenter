import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: data.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "endorsement_group_id",
            validationObject: data.endorsement_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

export default {
    validateCreateRequest,
};
