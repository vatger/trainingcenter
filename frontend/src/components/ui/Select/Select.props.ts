import { ReactElement } from "react";

export type SelectProps = {
    className?: string;
    defaultValue?: string | number;
    name?: string;
    selectClassName?: string;
    label?: string;
    value?: any;
    required?: boolean;
    description?: string;
    labelSmall?: boolean;
    disabled?: boolean;
    preIcon?: ReactElement;
    hideSpinner?: boolean;
    loading?: boolean;
    inputError?: boolean;
    children?: ReactElement[] | ReactElement;
    onChange?: (value: string) => any;
};
