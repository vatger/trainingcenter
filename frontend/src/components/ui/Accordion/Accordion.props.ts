import { ReactElement } from "react";

export type AccordionProps = {
    expanded?: boolean;
    title?: string;
    disabled?: boolean;
    children?: ReactElement | ReactElement[];
    className?: string;
};
