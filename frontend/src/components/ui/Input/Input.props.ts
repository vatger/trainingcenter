import React, { ReactElement } from "react";

export type InputProps = {
    label?: string | ReactElement;
    id?: string;
    name?: string;
    inputError?: boolean;
    hideInputErrorText?: boolean;
    customInputErrorText?: string;
    required?: boolean;
    description?: string;
    labelSmall?: boolean;
    hideSpinner?: boolean;
    className?: string;
    inputClassName?: string;
    fieldClassName?: string;
    type?: string;
    value?: string;
    maxLength?: number;

    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    loading?: boolean;

    min?: string | number;
    max?: string | number;

    dataFormType?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
    onClick?: () => any;

    preIcon?: ReactElement;
    regex?: RegExp;
    regexMatchEmpty?: boolean;
    regexCheckInitial?: boolean;
};
