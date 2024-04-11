import { TableProps } from "./Table.props";
import { Input } from "../Input/Input";
import DataTable, { TableColumn } from "react-data-table-component";
import { TbSortDescending } from "react-icons/tb";
import { Spinner } from "../Spinner/Spinner";
import { RenderIf } from "../../conditionals/RenderIf";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import tableTranslation from "../../../assets/lang/table.translation";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import { fuzzySearch } from "@/utils/helper/fuzzysearch/FuzzySearchHelper";

const TABLE_PAGINATION_PER_PAGE_DEFAULT = 15;

function search(headers: (TableColumn<any> & { searchable?: boolean })[], data: Object[], searchString: string, fuzzy = false): Object[] {
    const lowerCaseSearchString = searchString.toLowerCase();
    let searchableIndexArray: number[] = [];
    let filteredData: Object[] = [];

    headers.forEach((value, index) => {
        if (value.searchable) searchableIndexArray.push(index);
    });

    let searchArray = [];
    for (const dataValue of data) {
        for (const value of searchableIndexArray) {
            if (headers[value] == null) continue;
            const selected = headers[value].selector?.(dataValue);
            if (selected == null) continue;

            if (fuzzy) {
                searchArray.push(selected);
                continue;
            }

            if (selected.toString().toLowerCase().indexOf(lowerCaseSearchString) != -1) {
                filteredData.push(dataValue);
                break;
            }
        }

        if (fuzzy && fuzzySearch(searchString, searchArray).length > 0) {
            filteredData.push(dataValue);
        }
    }

    return filteredData;
}

export function Table(props: TableProps) {
    const language = useSettingsSelector().language;

    const [searchInput, setSearchInput] = useState<string>("");
    const debouncedSearch = useDebounce<string>(searchInput, 250);

    const [data, setData] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (debouncedSearch.length === 0) {
            setData([...props.data]);
            return;
        }

        setData(search(props.columns, props.data, debouncedSearch, props.fuzzySearch));
    }, [debouncedSearch]);

    useEffect(() => {
        setData([...props.data]);
        setLoading(props.loading ?? false);
    }, [props.data, props.loading]);

    let shouldPaginate = props.paginate ?? data.length > (props.paginationPerPage ?? TABLE_PAGINATION_PER_PAGE_DEFAULT);

    return (
        <>
            <div className={`${props.className ?? ""} ${shouldPaginate ? "" : "mb-5"}`}>
                <RenderIf
                    truthValue={props.searchable ?? false}
                    elementTrue={
                        <div className={"flex sm:flex-row flex-col justify-end mb-3"}>
                            <span className={"sm:pr-3 sm:pb-0 pb-1 my-auto"}>Suchen: </span>
                            <Input
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                disabled={props.loading}
                                className={"min-w-[25%]"}
                                placeholder={props.searchPlaceholder ?? "Search..."}
                            />
                        </div>
                    }
                />

                <DataTable
                    defaultSortFieldId={props.defaultSortField}
                    sortIcon={<TbSortDescending className={"ml-2"} />}
                    data={data}
                    defaultSortAsc={props.defaultSortAsc}
                    noDataComponent={<div className={"p-4"}>{tableTranslation.noData[language]}</div>}
                    columns={props.columns}
                    pagination={shouldPaginate}
                    paginationPerPage={props.paginationPerPage ?? TABLE_PAGINATION_PER_PAGE_DEFAULT}
                    paginationRowsPerPageOptions={[5, 10, 15, 30, 50, 100]}
                    className={"table-default tab-hide-scrollbar"}
                    progressPending={loading}
                    progressComponent={<Spinner className={"mt-7"} size={35} />}
                    persistTableHead={props.persistTableHead ?? true}
                />
            </div>
        </>
    );
}
