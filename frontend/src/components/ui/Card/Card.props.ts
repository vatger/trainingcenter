import React, { ReactElement } from "react";

export type CardProps = {
    children?: ReactElement | ReactElement[];
    status?: ReactElement;
    className?: string;
    clickable?: boolean;
    bordered?: boolean;

    bodyClassName?: string;

    header?: ReactElement | string;
    headerBorder?: boolean;
    headerExtra?: ReactElement;
    headerClassName?: string;

    footer?: ReactElement;
    footerBorder?: boolean;
    footerClassName?: string;

    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
