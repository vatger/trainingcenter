import { CardProps } from "./Card.props";
import { joinClassNames } from "../../../utils/helper/ClassNameHelper";

export function Card(props: CardProps) {
    const cardClasses = joinClassNames(
        "card",
        props.className ?? "",
        props.bordered ? "card-border" : "card-shadow",
        props.clickable ? "cursor-pointer user-select-none" : ""
    );

    const headerClasses = joinClassNames(
        "card-header flex md:flex-row flex-col md:justify-between justify-start",
        props.headerBorder ? "card-header-border" : "",
        props.headerExtra ? "card-header-extra" : "",
        props.headerClassName ?? ""
    );

    const bodyClasses = joinClassNames("card-body", props.bodyClassName ?? "");

    const footerClasses = joinClassNames("card-footer", props.footerBorder ? "card-footer-border" : "", props.footerClassName ?? "");

    function renderHeader() {
        if (typeof props.header === "string") {
            return <h4 className={"self-start md:mb-0 mb-2"}>{props.header}</h4>;
        }

        return <>{props.header}</>;
    }

    return (
        <div className={cardClasses} onClick={e => props.onClick?.(e)}>
            {props.header && (
                <div className={headerClasses}>
                    {renderHeader()}
                    {props.headerExtra && <span className={"md:self-auto self-start"}>{props.headerExtra}</span>}
                </div>
            )}
            <div className={bodyClasses}>{props.children}</div>
            {props.footer && <div className={footerClasses}>{props.footer}</div>}
        </div>
    );
}
