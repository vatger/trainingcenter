import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { SeparatorProps } from "./Separator.props";

export function Separator(props: SeparatorProps) {
    const classes = joinClassNames("w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-5", props.className ?? "");

    return <div className={classes} />;
}
