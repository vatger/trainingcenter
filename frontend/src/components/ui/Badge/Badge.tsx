import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { getBadgeColorClass } from "./Badge.helper";
import { BadgeProps } from "./Badge.props";

export function Badge(props: BadgeProps) {
    const classes = joinClassNames("badge font-semibold", getBadgeColorClass(props.color), props.className ?? "");

    return <span className={classes}>{props.children}</span>;
}
