import { ReactElement } from "react";

export type TabsProps = {
    tabHeaders: string[];
    tabHeaderAddition?: ReactElement[];
    children: ReactElement[];
    type: "pills" | "underline";
    onChange?: (index: number) => any;
    disabled?: boolean;
};
