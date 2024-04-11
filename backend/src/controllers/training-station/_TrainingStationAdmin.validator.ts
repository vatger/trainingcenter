import { ValidationException } from "../../exceptions/ValidationException";

function validateCreateStations(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "body",
    //         validationObject: data,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.LENGTH_GT, value: 0 }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateUpdateStation(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "callsign",
    //         validationObject: data.callsign,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "frequency",
    //         validationObject: data.frequency,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

export default {
    validateCreateStations,
    validateUpdateStation,
};
