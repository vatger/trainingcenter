import { ButtonProps } from "./Button.props";
import { getButtonColor, getButtonShape, getButtonSize } from "./Button.helper";
import { joinClassNames } from "@/utils/helper/ClassNameHelper";
import React from "react";
import { Spinner } from "../Spinner/Spinner";
import { getRgbFromColorOpt } from "@/utils/helper/ColorHelper";

export function Button(props: ButtonProps) {
    const defaultClass = "button";
    const buttonSizeClass = getButtonSize(props);
    const buttonColorClass = getButtonColor(props);
    const buttonShapeClass = getButtonShape(props);

    const classes = joinClassNames(defaultClass, buttonColorClass, buttonSizeClass, buttonShapeClass, props.className ?? "", props.block ? "w-full" : "");

    function renderChildren() {
        if (props.loading && props.children) {
            let color = getRgbFromColorOpt(props.color);
            if (props.resetSpinnerColor == true) color = "";

            return (
                <span className="flex items-center justify-center flex-row">
                    <Spinner borderWidth={2} size={18} color={color} className={"m-0"} />
                    <div className={"ml-4"}>{props.children}</div>
                </span>
            );
        }

        if (props.icon && !props.children && props.loading) {
            let color = getRgbFromColorOpt(props.color);
            if (props.resetSpinnerColor == true) color = "";

            return (
                <div className={"p-2"}>
                    <Spinner borderWidth={2} size={18} color={color} />
                </div>
            );
        }

        if (props.icon && !props.children && !props.loading) {
            return <div className={"px-2"}>{props.icon}</div>;
        }

        if (props.icon && props.children && !props.loading) {
            return (
                <span className="flex items-center justify-center">
                    <span className="text-lg mr-2">{props.icon}</span>
                    <span className="ml-2">{props.children}</span>
                </span>
            );
        }

        return <>{props.children}</>;
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (props.disabled || props.loading) {
            e.preventDefault();
            return;
        }
        props.onClick?.(e);
    }

    return (
        <button type={props.type ?? "button"} className={classes} onClick={e => handleClick(e)}>
            {renderChildren()}
        </button>
    );
}
