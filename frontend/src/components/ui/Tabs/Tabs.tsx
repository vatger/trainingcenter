import { useEffect, useState } from "react";
import { TabsProps } from "./Tabs.props";

function getTabByLocationHash(tabHeaders: string[]): number {
    let hash = window.location.hash.substring(1);
    if (hash == null || hash.length == 0) return 0;

    tabHeaders = tabHeaders.map(value => value.toLowerCase());
    hash = hash.toLowerCase();

    if (Array.isArray(tabHeaders)) {
        const idx = tabHeaders.indexOf(decodeURIComponent(hash));
        return idx == -1 ? 0 : idx;
    }
    return 0;
}

export function Tabs(props: TabsProps) {
    const [activePage, setActivePage] = useState<number>(getTabByLocationHash(props.tabHeaders as string[]));

    const headerClasses = {
        active: props.type == "underline" ? "tab-nav-active text-indigo-600 border-indigo-600" : "tab-nav-active text-indigo-600 bg-indigo-50",
        inactive: props.type == "underline" ? "tab-nav tab-nav-underline dark:text-indigo-100" : "tab-nav tab-nav-pill dark:text-indigo-100",
    };

    useEffect(() => {
        setActivePage(getTabByLocationHash(props.tabHeaders as string[]));
    }, [window.location.hash]);

    return (
        <div className="tabs">
            <div
                role="tablist"
                className={
                    "sm:tab-list tab-list-sm tab-hide-scrollbar overflow-x-hidden sm:overflow-x-auto" +
                    (props.type === "underline" ? " tab-list-underline" : " tab-list-pill")
                }>
                {props.tabHeaders.map((value, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (props.disabled) return;

                                setActivePage(index);
                                window.history.replaceState(null, "", `#${(value as string).toLowerCase()}`);
                                props.onChange?.(index);
                            }}
                            className={"w-full select-none sm:w-auto " + headerClasses.inactive + (index === activePage ? " " + headerClasses.active : "")}
                            role="tab"
                            aria-selected={index === 0 ? "true" : "false"}>
                            <>
                                {value} {props?.tabHeaderAddition?.[index] ?? null}
                            </>
                        </div>
                    );
                })}
            </div>
            <div className={"pt-4"}>{props.children[activePage]}</div>
        </div>
    );
}
