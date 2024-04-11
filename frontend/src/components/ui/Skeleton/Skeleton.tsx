import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { SkeletonProps } from "./Skeleton.props";

export function Skeleton(props: SkeletonProps) {
    const classes = joinClassNames(
        "skeleton",
        props.circle ? "skeleton-circle" : "skeleton-block",
        props.noAnimation ? "" : "animate-pulse",
        props.className ?? ""
    );

    return <div className={classes} style={{ height: props.height ?? "100%", width: props.width ?? "100%", ...props.style }} />;
}
