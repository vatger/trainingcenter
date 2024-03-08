import dayjs from "dayjs";
import { ValidationException } from "../exceptions/ValidationException";

type ValidationRule = Record<string, Array<ValidationTypeEnum | { option: ValidationTypeEnum; value: any } | ((arg0: any) => boolean)>>;

/**
 * Supported Validation Options
 * If you wish to add further validations, edit the switch of write a custom function ((arg0: any) => boolean) which validates in-place.
 */
enum ValidationTypeEnum {
    NON_NULL,
    MAX_LENGTH,
    MIN_LENGTH,
    NUMBER,
    NOT_EQUAL,
    IN_ARRAY,
    IS_ARRAY,
    VALID_DATE,
    ARRAY_LENGTH_GT,
    VALID_JSON,
}

function validateAndReturn(data: any, validationRules: ValidationRule) {
    try {
        validate(data, validationRules);
    } catch (e) {
        console.log(e);

        return false;
    }

    return true;
}

/**
 * Validates given data according to a predefined set of rules.
 * See ValidationTypeEnum for all possible validation types
 * @param data
 * @param validationRules
 * @throws ValidationException if the validation fails. This is
 * automatically caught by the Middleware presenting the user with a readable error
 */
function validate(data: any, validationRules: ValidationRule) {
    let messages: object[] = [];

    const dataKeys = Object.keys(data);
    const validationKeys = Object.keys(validationRules);

    for (const key of validationKeys) {
        if (!dataKeys.includes(key)) {
            messages.push({
                code: "VAL_MISS",
                key: key,
                message: `The above key is missing from the request body`,
            });
            continue;
        }

        for (const rule of validationRules[key]) {
            if (typeof rule == "number") {
                // Validate ENUM Field (no Value)
                _validateEntry(data[key], key, messages, { option: rule });
            }

            if (typeof rule == "object") {
                // Validate ENUM Field (with Value)
                _validateEntry(data[key], key, messages, { option: rule.option, value: rule.value });
            }

            if (typeof rule == "function") {
                // Custom validation function
                const invalid = rule(data[key]);
                if (invalid) {
                    messages.push({ code: "VAL_FAI", key: key, message: "N/A" });
                }
            }
        }
    }

    if (messages.length > 0) {
        throw new ValidationException(messages);
    }
}

function _validateEntry(data: any, key: string, messages: object[], valOption: { option: ValidationTypeEnum; value?: any }) {
    function addErrorEntry(message: string) {
        messages.push({ code: ValidationTypeEnum[valOption.option], key: key, message: message });
    }

    switch (valOption.option) {
        case ValidationTypeEnum.NON_NULL:
            if (data == null || data.length == 0) {
                addErrorEntry("Parameter required");
            }
            break;

        case ValidationTypeEnum.MAX_LENGTH:
            if (data.length >= valOption.value) {
                addErrorEntry(`Parameter exceeds MAX_LENGTH (${valOption.value})`);
            }
            break;

        case ValidationTypeEnum.MIN_LENGTH:
            if (data.length <= valOption.value) {
                addErrorEntry(`Parameter lower than MIN_LENGTH (${valOption.value})`);
            }
            break;

        case ValidationTypeEnum.NUMBER:
            let n = Number(data);
            if (Number.isNaN(n)) {
                addErrorEntry(`Parameter is not a number`);
            }
            break;

        case ValidationTypeEnum.NOT_EQUAL:
            let invalid = false;
            if (typeof valOption.value == "number" && Number(data) === valOption.value) break;
            if (typeof valOption.value == "string" && data.toLowerCase() == valOption.value) break;

            addErrorEntry(`Parameter can't equal ${valOption.value}`);

            break;

        case ValidationTypeEnum.IN_ARRAY:
            const arr = valOption.value as any[];
            if (!arr.includes(data)) {
                addErrorEntry(`Parameter does not match accepted list`);
            }
            break;

        case ValidationTypeEnum.IS_ARRAY:
            if (!Array.isArray(data)) {
                addErrorEntry("Parameter is not an array");
            }
            break;

        case ValidationTypeEnum.VALID_DATE:
            if (!dayjs(data).isValid()) {
                addErrorEntry("Parameter is not a valid date");
            }
            break;

        case ValidationTypeEnum.ARRAY_LENGTH_GT:
            if (!Array.isArray(data) || data.length <= valOption.value) {
                addErrorEntry("The length of the array does not meet minimum requirements");
            }
            break;

        case ValidationTypeEnum.VALID_JSON:
            try {
                if (typeof data == "string") {
                    JSON.parse(data);
                } else {
                    JSON.parse(JSON.stringify(data));
                }
            } catch (e) {
                addErrorEntry("Paramter is not valid JSON");
            }
            break;
    }
}

export { ValidationTypeEnum };
export default { validate, validateAndReturn };
