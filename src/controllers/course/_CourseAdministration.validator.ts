import { ValidatorType } from "../_validators/ValidatorType";
import { ValidationException } from "../../exceptions/ValidationException";

function validateUpdateOrCreateRequest(data: any) {
    // const validation = ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "name_de",
    //         validationObject: data.name_de,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "name_en",
    //         validationObject: data.name_en,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "description_de",
    //         validationObject: data.description_de,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "description_en",
    //         validationObject: data.description_en,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "self_enrol_enabled",
    //         validationObject: data.self_enrol_enabled,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "active",
    //         validationObject: data.active,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "training_type_id",
    //         validationObject: data.training_type_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
    //
    // if (validation.invalid) {
    //     throw new ValidationException(validation);
    // }
}

function validateAddMentorGroupRequest(data: any) {
    // return ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "mentor_group_id",
    //         validationObject: data.mentor_group_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    //     {
    //         name: "can_edit",
    //         validationObject: data.can_edit,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);
}

function validateRemoveMentorGroupRequest(data: any) {
    // return ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "mentor_group_id",
    //         validationObject: data.mentor_group_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
}

function validateRemoveParticipantRequest(data: any) {
    // return ValidationHelper.validate([
    //     {
    //         name: "user_id",
    //         validationObject: data.user_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);
}

function validateUUID(data: any) {
    // return ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: data.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);
}

export default {
    validateUpdateOrCreateRequest,
    validateAddMentorGroupRequest,
    validateRemoveMentorGroupRequest,
    validateRemoveParticipantRequest,
    validateUUID,
};
