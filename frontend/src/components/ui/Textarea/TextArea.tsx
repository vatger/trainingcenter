import { useEffect, useState } from "react";
import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { TbAlertCircle } from "react-icons/tb";
import { getColorClassBasedOnPercentage } from "../../../utils/helper/ColorHelper";
import { RenderIf } from "../../conditionals/RenderIf";
import { TextAreaProps } from "./TextArea.props";

export function TextArea(props: TextAreaProps) {
    const [inputVal, setInputVal] = useState<string>(props.value ?? "");
    const [regexMatchFail, setRegexMatchFail] = useState<boolean>(false);

    const inputDefaultClass = "input input-textarea";
    const inputFocusClass = `focus:ring-indigo-500 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus:border-indigo-500`;
    const inputWrapperClass = `input-wrapper`;

    const classes = joinClassNames(
        inputDefaultClass,
        inputFocusClass,
        inputWrapperClass,
        props.inputError || regexMatchFail ? "border-red-400 dark:border-red-500" : "",
        props.disabled || props.loading ? "input-disabled" : "",
        props.noResize ? "resize-none" : "resize-y",
        props.textAreaClassName ?? ""
    );

    const labelClasses = joinClassNames(props.labelSmall ? "text-sm" : "", props.description == null ? "mb-2" : "");

    useEffect(() => {
        setRegexMatchFail(false);
        setInputVal(props.value ?? "");
    }, [props.value]);

    useEffect(() => {
        if (props.regexCheckInitial) checkRegex(inputVal);
    }, []);

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

            <textarea
                name={props.name}
                spellCheck={false}
                disabled={props.disabled ?? false}
                placeholder={props.placeholder ?? ""}
                value={inputVal}
                onChange={e => {
                    checkRegex(e.target.value);
                    setInputVal(e.target.value);
                    props.onChange?.(e);
                }}
                maxLength={props.maxLength}
                rows={props.rows}
                className={classes}
            />

            <RenderIf
                truthValue={props.maxLength != null && !props.inputError && !regexMatchFail}
                elementTrue={
                    <div className={"mt-1.5"}>
                        <span
                            className={getColorClassBasedOnPercentage(
                                // @ts-ignore, we know that maxLength is != null from the render-if statement above
                                (inputVal.length / props.maxLength) * 100,
                                true
                            )}>
                            {inputVal.length} / {props.maxLength} Zeichen
                        </span>
                    </div>
                }
            />

            <RenderIf
                truthValue={props.inputError || regexMatchFail}
                elementTrue={
                    <span className={"text-danger flex mt-1.5"}>
                        <TbAlertCircle className={"my-auto mr-1"} size={16} />
                        Gebe bitte einen gültigen Wert ein
                    </span>
                }
            />
        </div>
    );
}
