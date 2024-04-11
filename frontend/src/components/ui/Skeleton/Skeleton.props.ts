import { CSSProperties } from "react";

export type SkeletonProps = {
    height?: number;
    width?: number;
    noAnimation?: boolean;
    circle?: boolean;
    className?: string;
    style?: CSSProperties;
};
