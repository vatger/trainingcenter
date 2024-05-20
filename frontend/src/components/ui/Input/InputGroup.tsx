import { ReactElement } from "react";

/**
 * Creates a grid of inputs to allow coherence between pages
 * @constructor
 */
export function InputGroup({ children }: { children: ReactElement | ReactElement[] }) {
    return <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>{children}</div>;
}
