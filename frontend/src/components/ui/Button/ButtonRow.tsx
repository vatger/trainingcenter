import { ReactElement } from "react";

/**
 * Utility component which wraps an arbitrary number of buttons
 * and causes them to equally wrap on all pages!
 * @param children
 * @constructor
 */
export function ButtonRow({ children }: { children: ReactElement | ReactElement[] }) {
    return <div className={"flex flex-wrap flex-col md:flex-row gap-2"}>{children}</div>;
}
