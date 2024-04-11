import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import React, { ReactNode } from "react";

export type ButtonProps = {
    variant?: "solid" | "twoTone" | "plain" | "default";
    type?: "submit" | "button" | "reset";
    color?: COLOR_OPTS;
    size?: SIZE_OPTS;
    shape?: "round" | "circle" | "none";
    disabled?: boolean;
    icon?: ReactNode;
    children?: ReactNode;

    className?: string;

    active?: boolean;
    loading?: boolean;
    resetSpinnerColor?: boolean;
    block?: boolean;

    // Functions
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
