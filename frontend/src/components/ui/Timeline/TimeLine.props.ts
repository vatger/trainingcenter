import { ReactElement } from "react";

export type TimeLineProps = {
    children: ReactElement[] | ReactElement;
};

export type TimeLineItemProps = {
    color: string;
    avatarIcon: ReactElement;
    showConnectionLine: boolean;
    children?: ReactElement | ReactElement[] | string;
};
