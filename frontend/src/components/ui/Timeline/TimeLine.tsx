import React from "react";
import { RenderIf } from "../../conditionals/RenderIf";
import { TimeLineItemProps, TimeLineProps } from "./TimeLine.props";

export function TimeLine(props: TimeLineProps) {
    return <ul className="timeline">{props.children}</ul>;
}

export function TimeLineItem(props: TimeLineItemProps) {
    return (
        <li className="timeline-item">
            <div className="timeline-item-wrapper">
                <div className="timeline-item-media">
                    <div className="timeline-item-media-content">
                        <span className={`avatar avatar-circle w-[29px] h-[29px] w-min-[29px] ${props.color}`} style={{ lineHeight: "29px", fontSize: "12px" }}>
                            {props.avatarIcon}
                        </span>
                    </div>
                    <RenderIf truthValue={props.showConnectionLine} elementTrue={<div className="timeline-connect"></div>} />
                </div>
                <div className="timeline-item-content">{props.children}</div>
            </div>
        </li>
    );
}
