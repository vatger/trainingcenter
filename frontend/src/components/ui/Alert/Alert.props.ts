import { TYPE_OPTS } from "../../../assets/theme.config";
import { ReactElement } from "react";

export type AlertProps = {
    type: TYPE_OPTS;
    title?: string;
    showIcon?: boolean;
    children?: ReactElement | string;
    className?: string;
    rounded?: boolean;
    shadow?: boolean;
    closeable?: boolean;
    onClose?: () => any;
};
