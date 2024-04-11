import { ButtonProps } from "./Button.props";
import { CONTROL_SIZES, SIZE_OPTS } from "../../../assets/theme.config";
import { joinClassNames } from "../../../utils/helper/ClassNameHelper";

const sizeIconClass = "inline-flex items-center justify-center";
const disabledClass = "opacity-70 cursor-not-allowed";

export function getButtonShape(props: ButtonProps) {
    if (props.loading && !props.children) return `rounded-full`;

    return props.shape ? `radius-${props.shape}` : `radius-round`;
}

/**
 * Gets the button's size class string from props
 * @param props
 */
export function getButtonSize(props: ButtonProps): string {
    let sizeClass = "";

    switch (props.size) {
        case SIZE_OPTS.XS:
            sizeClass = joinClassNames(
                `h-${CONTROL_SIZES.XS}`,
                props.icon && !props.children ? `w-${CONTROL_SIZES.XS} ${sizeIconClass} text-base` : `px-3 py-1 text-xs`
            );
            break;

        case SIZE_OPTS.SM:
            sizeClass = joinClassNames(
                `h-${CONTROL_SIZES.SM}`,
                props.icon && !props.children ? `w-${CONTROL_SIZES.SM} ${sizeIconClass} text-lg` : `px-4 py-2 text-sm`
            );
            break;

        case SIZE_OPTS.LG:
            sizeClass = joinClassNames(
                `h-${CONTROL_SIZES.LG}`,
                props.icon && !props.children ? `w-${CONTROL_SIZES.LG} ${sizeIconClass} text-2xl` : `px-8 py-3 text-base`
            );
            break;

        default:
            sizeClass = joinClassNames(`h-${CONTROL_SIZES.MD}`, props.icon && !props.children ? `w-${CONTROL_SIZES.MD} ${sizeIconClass} text-xl` : `px-8 py-2`);
            break;
    }

    return sizeClass;
}

/**
 * Gets the button's color class string from props
 * @param props
 */
export function getButtonColor(props: ButtonProps) {
    let btnStyle;

    switch (props.variant) {
        case "default":
            btnStyle = {
                bgColor: props.active
                    ? `bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:border-gray-500`
                    : `bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700`,
                textColor: `text-gray-600 dark:text-gray-100`,
                hoverColor: props.active ? "" : `hover:bg-gray-50 dark:hover:bg-gray-600`,
                activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
            };
            break;

        case "twoTone":
            btnStyle = {
                bgColor: props.active
                    ? `bg-${props.color}-200 dark:bg-${props.color}-100`
                    : `bg-${props.color}-50 dark:bg-${props.color}-500 dark:bg-opacity-20`,
                textColor: `text-${props.color}-600 dark:text-${props.color}-50`,
                hoverColor: props.active ? "" : `hover:bg-${props.color}-100 dark:hover:bg-${props.color}-500 dark:hover:bg-opacity-30`,
                activeColor: `active:bg-${props.color}-200 dark:active:bg-${props.color}-500 dark:active:bg-opacity-40`,
            };
            break;

        case "solid":
            btnStyle = {
                bgColor: props.active ? `bg-${props.color}-600` : `bg-${props.color}-500`,
                textColor: "text-white",
                hoverColor: props.active ? "" : `hover:bg-${props.color}-400`,
                activeColor: `active:bg-${props.color}-600`,
            };
            break;

        default:
            btnStyle = {
                bgColor: props.active
                    ? `bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:border-gray-500`
                    : `bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700`,
                textColor: `text-gray-600 dark:text-gray-100`,
                hoverColor: props.active ? "" : `hover:bg-gray-50 dark:hover:bg-gray-600`,
                activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
            };
            break;
    }

    return parseButtonColorObject({ disabled: props.disabled ?? false, loading: props.loading ?? false, ...btnStyle });
}

function parseButtonColorObject({
    disabled,
    loading,
    bgColor,
    hoverColor,
    activeColor,
    textColor,
}: {
    disabled: boolean;
    loading: boolean;
    bgColor: string;
    hoverColor: string;
    activeColor: string;
    textColor: string;
}): string {
    return `${bgColor} ${disabled || loading ? disabledClass : hoverColor + " " + activeColor} ${textColor}`;
}
