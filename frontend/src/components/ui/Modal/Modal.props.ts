import { ReactElement } from "react";

export type ModalProps = {
    show: boolean;
    onClose?: () => any;
    title: string;
    children?: ReactElement | ReactElement[];
    footer?: ReactElement | ReactElement[];
};
