import { SpinnerProps } from "./Spinner.props";

import "./spinner.css";

export function Spinner(props: SpinnerProps) {
    return (
        <div
            className={`loader border-l-indigo-700 dark:border-l-indigo-500 border-gray-200 dark:border-gray-700 ${props.className}`}
            style={{
                width: props.size ?? 40,
                height: props.size ?? 40,
                borderWidth: props.borderWidth ?? 3,
                borderLeftColor: props.color ? props.color : "",
            }}>
            Loading...
        </div>
    );
}
