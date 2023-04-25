export function validateObject(object: any, keys: string[], checkStringNull = false) {
    let malformedKeys: any[] = [];

    keys.forEach(value => {
        if (object[value] == null || (checkStringNull && object[value] == "")) {
            malformedKeys.push(value);
        }
    });

    return malformedKeys;
}

type ValidationType = {
    name: string;
    validationObject: any;
    toValidate: Array<{ val: ValidationOptions; value?: any }>;
};

export enum ValidationOptions {
    NON_NULL,
    MAX_LENGTH,
    MIN_LENGTH,
    NUMBER,
    NOT_EQUAL,
    NOT_EQUAL_NUM,
    IN_ARRAY,
}

/**
 *
 * @param options
 */
function validate(options: ValidationType[]): { invalid: boolean; message: any[] } {
    let invalid = false;
    let message: any[] = [];

    for (let i = 0; i < options.length; i++) {
        const opt: ValidationType = options[i];

        let toCheck = opt.validationObject;
        // Replace spaces with nothing!
        if (typeof opt.validationObject == "string") toCheck = toCheck.replace(/\s/g, "");

        opt.toValidate.forEach(val => {
            switch (val.val) {
                case ValidationOptions.NON_NULL:
                    if (toCheck == null || toCheck.length == 0) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_NULL", message: "The parameter is NULL, although it is not allowed to be NULL." });
                    }
                    break;

                case ValidationOptions.MAX_LENGTH:
                    if (toCheck.length >= val.value) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_MAX_LEN", message: "Parameter exceeds MAX_LENGTH." });
                    }
                    break;

                case ValidationOptions.MIN_LENGTH:
                    if (toCheck.length <= val.value) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_MIN_LEN", message: "Parameter lower than MIN_LENGTH." });
                    }
                    break;

                case ValidationOptions.NUMBER:
                    let n = Number(toCheck);
                    if (Number.isNaN(n)) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_NAN", message: "Parameter is not a number." });
                    }
                    break;

                case ValidationOptions.NOT_EQUAL:
                    if (toCheck.toLowerCase() == val.value) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_NEQ", message: `Parameter is equal to ${val.value}. It must be not equal.` });
                    }
                    break;

                case ValidationOptions.NOT_EQUAL_NUM:
                    if (Number(toCheck) === val.value) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_NEQ_NUM", message: `Parameter is equal to ${val.value}. It must be not equal.` });
                    }
                    break;

                case ValidationOptions.IN_ARRAY:
                    const arr = val.value as any[];
                    if (!arr.includes(toCheck)) {
                        invalid = true;
                        message.push({ key: opt.name, code: "VAL_NOT_ARR", message: `Parameter is not contained in possible options: ${arr}.` });
                    }
                    break;
            }
        });
    }

    return {
        invalid: invalid,
        message: message,
    };
}

export default {
    validate,
};
