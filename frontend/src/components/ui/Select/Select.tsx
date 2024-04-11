import { SelectProps } from "./Select.props";
import { joinClassNames } from "@/utils/helper/ClassNameHelper";
import { TbAlertCircle, TbChevronDown } from "react-icons/tb";
import { useState } from "react";
import { Spinner } from "../Spinner/Spinner";

export function Select(props: SelectProps) {
    const [focus, setFocus] = useState<boolean>(false);

    const classes = joinClassNames(
        "select relative input focus:ring-indigo-500 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus:border-indigo-500 input-wrapper",
        props.disabled ? "input-disabled" : "bg-white",
        props.selectClassName ?? "",
        props.inputError ? "border-red-400 dark:border-red-500" : "",
        props.preIcon ? "input-icon-pre" : ""
    );

    const labelClasses = joinClassNames(props.labelSmall ? "text-sm" : "", props.description == null ? "mb-2" : "");

    return (
        <div className={props.className ?? ""}>
            {props.label && (
                <h6 className={labelClasses}>
                    {props.label} {props.required && <span className={"text-red-500"}>*</span>}
                </h6>
            )}
            {props.description && <p className={"mb-2 " + (props.labelSmall ? "text-xs" : "")}>{props.description}</p>}

            <div className={"relative " + (props.selectClassName ?? "")}>
                <select
                    value={props.value?.toString() ?? undefined}
                    name={props.name}
                    defaultValue={props.defaultValue}
                    onBlur={() => setFocus(false)}
                    onClick={() => setFocus(!focus)}
                    onChange={e => props.onChange?.(e.target.value)}
                    disabled={props.disabled ?? false}
                    className={classes}>
                    {props.children}
                </select>
                <div className={"absolute mt-[-28px] right-3"}>
                    <TbChevronDown className={"transition-transform" + (focus ? " rotate-180" : " rotate-0")} size={20} />
                </div>
                {(props.preIcon || props.loading) && (
                    <div className={"input-suffix-start"}>
                        {props.loading && !props.hideSpinner && <Spinner size={18} borderWidth={2} className={"m-[1px]"} />}
                        {(!props.loading || props.hideSpinner) && props.preIcon}
                    </div>
                )}
            </div>

            {props.inputError && (
                <span className={"text-danger flex mt-1.5"}>
                    <TbAlertCircle className={"my-auto mr-1"} size={16} />
                    Gebe bitte einen gültigen Wert ein
                </span>
            )}
        </div>
    );
}
