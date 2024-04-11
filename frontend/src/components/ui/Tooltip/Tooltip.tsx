import { ReactElement, useRef } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { generateUUID } from "../../../utils/helper/UUIDHelper";

export function Tooltip(props: { children: ReactElement | ReactElement[]; content: string; className?: string }) {
    const uuid = useRef<string>(generateUUID());

    return (
        <div className={props.className}>
            <ReactTooltip id={`t-${uuid.current}`} noArrow place={"top"} offset={23} />
            <a data-tooltip-id={`t-${uuid.current}`} data-tooltip-content={props.content}>
                {props.children}
            </a>
        </div>
    );
}
