import React, { ReactElement } from "react";

export type MenuItemProps = {
    children?: ReactElement | string;
    active?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: ReactElement;
    icon_suffix?: ReactElement;
    href?: string;
    isNoLink?: boolean;
    requiredPerm?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLAnchorElement, MouseEvent>) => any;
};
