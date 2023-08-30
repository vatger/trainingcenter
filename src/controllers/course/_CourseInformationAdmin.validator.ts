import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { ValidatorType } from "../_validators/ValidatorType";

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
            name: "course_uuid",
            validationObject: data.course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "user_id",
            validationObject: data.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);
}

export default {
    validateGetMentorGroupsRequest,
    validateDeleteMentorGroupRequest,
    validateGetUsersRequest,
    validateDeleteUserRequest,
};
