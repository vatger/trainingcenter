import { useState } from "react";
import { TbChevronDown, TbFileOff } from "react-icons/tb";
import { RenderIf } from "../../conditionals/RenderIf";
import { AccordionProps } from "./Accordion.props";

export function Accordion(props: AccordionProps) {
    const [expanded, setExpanded] = useState<boolean>(props.expanded ?? false);

    return (
        <div className={"w-full " + (props.className ?? "")}>
            <div
                onClick={() => {
                    if (props.disabled) return;
                    setExpanded(!expanded);
                }}
                className={
                    `flex justify-between p-3 bg-gray-100 dark:bg-gray-700 ${props.disabled ? "hover:cursor-not-allowed" : "hover:cursor-pointer"} ` +
                    (expanded ? "rounded-t" : "rounded")
                }>
                <h6 className={"text-sm font-semibold select-none"}>{props.title}</h6>

                <RenderIf
                    truthValue={props.disabled ?? false}
                    elementTrue={<TbFileOff size={20} className={"transition-transform my-auto " + (expanded ? "rotate-180" : "")} />}
                    elementFalse={<TbChevronDown size={20} className={"transition-transform my-auto " + (expanded ? "rotate-180" : "")} />}
                />
            </div>
            <RenderIf truthValue={expanded} elementTrue={<div className={"rounded-b bg-gray-50 dark:bg-gray-900"}>{props.children}</div>} />
        </div>
    );
}
