import { ReactElement } from "react";

export type PageHeaderProps = {
    title: string | ReactElement;
    breadcrumbs?: ReactElement | string | number;
    hideBackLink?: boolean;
    navigateHref?: string;
};
