import { ValidationException } from "../../exceptions/ValidationException";

function validateGetByID(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "id",
    //         validationObject: data.id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateUpdate(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "name",
    //         validationObject: data.name,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "content",
    //         validationObject: data.content,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.VALID_JSON }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

export default {
    validateGetByID,
    validateUpdate,
};
