import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "name",
    //         validationObject: data.name,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "training_station_ids",
    //         validationObject: data.training_station_ids,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.IS_ARRAY }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateGetByIDRequest(data: any) {
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

function validateDeleteRequest(data: any) {
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

function validateUpdateRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "name",
    //         validationObject: data.name,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateStationRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "training_station_id",
    //         validationObject: data.training_station_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateRemoveUserRequest(data: any) {
    // const validation = ValidationHelper.validate([
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

export default {
    validateCreateRequest,
    validateUpdateRequest,
    validateDeleteRequest,
    validateGetByIDRequest,
    validateStationRequest,
    validateRemoveUserRequest,
};
