import { TbChevronLeft, TbChevronRight, TbDots } from "react-icons/tb";
import { useState } from "react";
import { PaginationProps } from "./Pagination.props";

export function Pagination(props: PaginationProps) {
    const [activePage, setActivePage] = useState<number>(props.initialPage ?? 0);

    const perPage = props.perPage ?? 10;
    const pages = Math.ceil(props.numElems / perPage);

    return (
        <div className="pagination">
            <span
                onClick={() => {
                    activePage != 0 && setActivePage(activePage - 1);
                }}
                className={"pagination-pager pagination-pager-prev " + (activePage == 0 ? "pagination-pager-disabled" : "")}>
                <TbChevronLeft size={16} />
            </span>
            <ul>
                {Array(pages <= 7 ? pages - 1 : 7)
                    .fill(0)
                    .map((value, index) => {
                        let element = (
                            <li
                                className={`pagination-pager ${
                                    activePage == index
                                        ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-50 dark:bg-indigo-600 dark:text-gray-100"
                                        : "pagination-pager-inactive"
                                }`}
                                tabIndex={0}>
                                {index + 1}
                            </li>
                        );
                        element =
                            index == 6 && pages > 7 ? (
                                <li className="pagination-pager pagination-pager-inactive">
                                    <TbDots className={"my-auto"} size={14} />
                                </li>
                            ) : (
                                element
                            );

                        return (
                            <span key={index} onClick={() => setActivePage(index)}>
                                {element}
                            </span>
                        );
                    })}
                <li className="pagination-pager pagination-pager-inactive" onClick={() => setActivePage(pages - 1)} tabIndex={0}>
                    {pages}
                </li>
            </ul>
            <span
                className="pagination-pager pagination-pager-next pagination-pager-inactive"
                onClick={() => {
                    activePage != pages - 1 && setActivePage(activePage + 1);
                }}>
                <TbChevronRight size={16} />
            </span>
        </div>
    );
}
