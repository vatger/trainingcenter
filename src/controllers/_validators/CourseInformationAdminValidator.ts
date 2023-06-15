import { ValidatorType } from "./ValidatorType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

function validateGetMentorGroupsRequest(course_uuid: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "uuid",
            validationObject: course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateDeleteMentorGroupRequest(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "course_id",
            validationObject: data.course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "mentor_group_id",
            validationObject: data.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateGetUsersRequest(uuid: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "uuid",
            validationObject: uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateDeleteUserRequest(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "course_id",
            validationObject: data.course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "user_id",
            validationObject: data.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateUpdateRequest(data: any): ValidatorType {
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
            name: "self_enrol",
            validationObject: data.self_enrol,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "active",
            validationObject: data.active,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "training_id",
            validationObject: data.training_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);
}

export default {
    validateGetMentorGroupsRequest,
    validateDeleteMentorGroupRequest,
    validateGetUsersRequest,
    validateDeleteUserRequest,
    validateUpdateRequest,
};
