import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCID(data: any, key: string = "cid") {
    const validation = ValidationHelper.validate([
        {
            name: key,
            validationObject: data[key],
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

export default {
    validateCID,
};
