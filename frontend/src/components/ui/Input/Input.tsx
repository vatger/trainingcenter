import { InputProps } from "./Input.props";
import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { Spinner } from "../Spinner/Spinner";
import { useEffect, useState } from "react";
import { TbAlertCircle } from "react-icons/tb";

export function Input(props: InputProps) {
    const [inputVal, setInputVal] = useState<string>(props.value ?? "");
    const [regexMatchFail, setRegexMatchFail] = useState<boolean>(false);

    useEffect(() => {
        setRegexMatchFail(false);
        setInputVal(props.value ?? "");
    }, [props.value]);

    useEffect(() => {
        if (props.regexCheckInitial) checkRegex(inputVal);
    }, []);

    const inputDefaultClass = "input";
    const inputFocusClass = `focus:ring-indigo-500 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus:border-indigo-500`;
    const inputWrapperClass = `input-wrapper`;

    const classes = joinClassNames(
        inputDefaultClass,
        inputFocusClass,
        inputWrapperClass,
        props.inputError || regexMatchFail ? "border-red-400 dark:border-red-500" : "",
        props.disabled || props.readOnly || props.loading ? "input-disabled" : "",
        props.preIcon || props.loading ? "input-icon-pre" : "",
        props.label ? "input-label" : "",
        props.fieldClassName ?? ""
    );

    const labelClasses = joinClassNames(props.labelSmall ? "text-sm" : "", props.description == null ? "mb-2" : "");

    function checkRegex(input: string) {
        if (props.regex == null) return;

        if (!input.match(props.regex) && (input.length > 0 || props.regexMatchEmpty)) {
            setRegexMatchFail(true);
        } else {
            setRegexMatchFail(false);
        }
    }

    return (
        <div className={props.className ?? ""}>
            {props.label && (
                <h6 className={labelClasses}>
                    {props.label} {props.required && <span className={"text-red-500"}>*</span>}
                </h6>
            )}
            {props.description && <p className={"mb-2 " + (props.labelSmall ? "text-xs" : "")}>{props.description}</p>}

            <div className={"relative " + (props.inputClassName ?? "")}>
                <input
                    id={props.id}
                    type={props.type ?? "text"}
                    value={inputVal}
                    min={props.min}
                    max={props.max}
                    data-form-type={props.dataFormType ?? "other"}
                    name={props.name}
                    required={props.required ?? false}
                    readOnly={props.readOnly ?? false}
                    maxLength={props.maxLength}
                    onClick={() => props.onClick?.()}
                    onChange={e => {
                        checkRegex(e.target.value);
                        setInputVal(e.target.value);
                        props.onChange?.(e);
                    }}
                    className={classes}
                    disabled={props.disabled || props.loading}
                    placeholder={props.placeholder}
                />
                {(props.preIcon || props.loading) && (
                    <div className={"input-suffix-start"}>
                        {props.loading && !props.hideSpinner && <Spinner size={18} borderWidth={2} className={"m-[1px]"} />}
                        {(!props.loading || props.hideSpinner) && props.preIcon}
                    </div>
                )}
            </div>

            {(props.inputError || regexMatchFail) && !props.hideInputErrorText && (
                <span className={"text-danger flex mt-1.5"}>
                    <TbAlertCircle className={"my-auto mr-1"} size={16} />
                    {props.customInputErrorText ?? "Gebe bitte einen gültigen Wert ein"}
                </span>
            )}
        </div>
    );
}
