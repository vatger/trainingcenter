import useApi from "@/utils/hooks/useApi";
import { Table } from "@/components/ui/Table/Table";
import { Input } from "@/components/ui/Input/Input";
import { useFilter } from "@/utils/hooks/useFilter";
import { useMemo, useState } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { fuzzySearch } from "@/utils/helper/fuzzysearch/FuzzySearchHelper";
import UserFilterTypes from "@/components/ui/UserFilter/UserFilter.types";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { IMinimalUser } from "@models/User";

interface IUserFilterProps {
    onUserSelect: (user: IMinimalUser) => any;
    removeIDs?: number[];
}

function filterFunction(user: IMinimalUser, searchValue: string) {
    return fuzzySearch(searchValue, [user.first_name + " " + user.last_name, user.id.toString()]).length > 0;
}

export function UserFilter(props: IUserFilterProps) {
    const { data: users, loading: loadingUsers } = useApi<IMinimalUser[]>({
        url: "/administration/user/min",
        method: "GET",
    });

    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedSearchValue = useDebounce<string>(searchValue);

    const filteredData = useFilter<IMinimalUser>(
        users?.filter(u => !props.removeIDs?.includes(u.id)) ?? [],
        searchValue,
        debouncedSearchValue,
        filterFunction,
        true
    );

    return (
        <>
            <Input label={"Benutzer Suchen"} labelSmall placeholder={"CID, Name"} value={searchValue} onChange={e => setSearchValue(e.target.value)} />

            <RenderIf
                truthValue={searchValue != ""}
                elementTrue={
                    <Table
                        className={"mt-3"}
                        paginationPerPage={5}
                        loading={loadingUsers || debouncedSearchValue != searchValue}
                        paginate
                        columns={UserFilterTypes.getColumns(props.onUserSelect)}
                        data={filteredData}
                    />
                }
            />
        </>
    );
}
