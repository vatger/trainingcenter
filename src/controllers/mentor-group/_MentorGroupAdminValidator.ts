import { ValidatorType } from "../_validators/ValidatorType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

function validateUpdate(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "mentor_group_id",
            validationObject: data.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "name",
            validationObject: data.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateAddUser(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: data.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "mentor_group_id",
            validationObject: data.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "group_admin",
            validationObject: data.group_admin,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "can_manage_course",
            validationObject: data.can_manage_course,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
}

function validateRemoveUser(data: any): ValidatorType {
    return ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: data.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "mentor_group_id",
            validationObject: data.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);
}

export default {
    validateUpdate,
    validateAddUser,
    validateRemoveUser,
};
