import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateRequest(data: any) {
    const validation = ValidationHelper.validate([
        {
            name: "name",
            validationObject: data.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "training_station_ids",
            validationObject: data.training_station_ids,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.IS_ARRAY }],
        },
    ]);

    if (validation.invalid) {
        throw new ValidationException(validation);
    }
}

export default {
    validateCreateRequest,
};
