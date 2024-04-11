import { ReactElement } from "react";

export type CheckboxProps = {
    className?: string;
    disabled?: boolean;
    name?: string;
    checked?: boolean;
    children?: ReactElement | ReactElement[] | string;
    readOnly?: boolean;
    onChange?: (e: boolean) => void;
    id?: string;
};
