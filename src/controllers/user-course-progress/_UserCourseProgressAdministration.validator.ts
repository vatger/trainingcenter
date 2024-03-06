import { ValidationException } from "../../exceptions/ValidationException";

function validateGetAllRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "user_id",
    //         validationObject: data.user_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateUpdateRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "course_completed",
    //         validationObject: data.course_completed,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "user_id",
    //         validationObject: data.user_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

export default {
    validateGetAllRequest,
    validateUpdateRequest,
};
