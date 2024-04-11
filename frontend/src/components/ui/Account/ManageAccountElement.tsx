import { ReactElement } from "react";

export type ManageAccountElementPartialProps = {
    className?: string;
    title: string | ReactElement;
    hideBottomBorder?: boolean;
    element: ReactElement;
    break?: boolean;
};

export function ManageAccountElement(props: ManageAccountElementPartialProps) {
    return (
        <div
            className={
                "w-full grid py-9" +
                (props.hideBottomBorder ? "" : " border-b dark:border-b-gray-700") +
                ` ${props.className} ${props.break ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3"}`
            }>
            <div className={"flex flex-col justify-center"}>
                <div className={"text-gray-500 dark:text-gray-400 font-semibold"}>{props.title}</div>
            </div>

            <div className={"w-full" + ` ${props.break ? "pt-3 md:pt-0 md:col-span-2" : "col-span-2"}`}>{props.element}</div>
        </div>
    );
}
