import { ReactElement } from "react";

/**
 * Utility component which wraps an arbitrary number of buttons
 * and causes them to equally wrap on all pages!
 * @param children
 * @param className
 * @constructor
 */
export function ButtonRow({ children, className }: { children: ReactElement | ReactElement[]; className?: string }) {
    return <div className={`flex flex-wrap flex-col md:flex-row gap-2 ${className}`}>{children}</div>;
}
