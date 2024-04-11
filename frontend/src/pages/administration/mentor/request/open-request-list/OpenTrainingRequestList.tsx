import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { TableColumn } from "react-data-table-component";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import OpenRequestListTypes from "./_types/OTRLList.types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { TbFilter } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import { useState } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { useFilter } from "@/utils/hooks/useFilter";
import { fuzzySearch } from "@/utils/helper/fuzzysearch/FuzzySearchHelper";
import { Card } from "@/components/ui/Card/Card";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { Badge } from "@/components/ui/Badge/Badge";
import useApi from "@/utils/hooks/useApi";

type SearchFilter = {
    modal_open: boolean;
    available_only: boolean;
};

const filterTrainingRequestFunction = (trainingRequest: TrainingRequestModel, searchValue: string) => {
    return (
        fuzzySearch(searchValue, [
            trainingRequest.training_type?.name ?? "",
            trainingRequest.user?.first_name,
            trainingRequest.user?.last_name,
            trainingRequest.user?.id,
            trainingRequest.training_station?.callsign,
        ]).length > 0
    );
};

export function OpenTrainingRequestList() {
    const navigate = useNavigate();
    const { data: trainingRequests, loading } = useApi<TrainingRequestModel[]>({
        url: "/administration/training-request",
        method: "get",
    });

    const [searchFilter, setSearchFilter] = useState<SearchFilter>({ modal_open: false, available_only: false });
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const debouncedInput = useDebounce(searchInputValue, 250);

    const columns: TableColumn<TrainingRequestModel>[] = OpenRequestListTypes.getColumns(navigate);
    const filteredTrainingRequests = useFilter<TrainingRequestModel>(trainingRequests ?? [], searchInputValue, debouncedInput, filterTrainingRequestFunction);

    return (
        <>
            <PageHeader title={"Offene Trainingsanfragen"} hideBackLink />

            <Card>
                <div className={"flex w-full lg:flex-row flex-col justify-between"}>
                    <Input
                        value={searchInputValue}
                        onChange={e => setSearchInputValue(e.target.value)}
                        className={"mb-2 w-full"}
                        disabled={loading}
                        label={"Anfragen Filtern"}
                        placeholder={
                            trainingRequests?.[0] != null
                                ? `${trainingRequests?.[0]?.user?.first_name} ${trainingRequests?.[0]?.user?.last_name}`
                                : "Max Mustermann"
                        }
                    />

                    <Button
                        disabled={loading}
                        className={"lg:ml-2 mb-2 mt-auto h-[39px]"}
                        variant={"twoTone"}
                        icon={<TbFilter size={20} />}
                        onClick={() => setSearchFilter({ ...searchFilter, modal_open: true })}
                        color={COLOR_OPTS.PRIMARY}>
                        Filter Hinzufügen (TODO)
                    </Button>
                </div>
            </Card>

            <Card className={"mt-5"}>
                <Tabs
                    tabHeaders={["Trainings", "Lessons"]}
                    tabHeaderAddition={[
                        <Badge color={COLOR_OPTS.PRIMARY} className={"ml-2"}>
                            {filteredTrainingRequests.filter((f: TrainingRequestModel) => f.training_type?.type != "lesson").length}
                        </Badge>,
                        <Badge color={COLOR_OPTS.PRIMARY} className={"ml-2"}>
                            {filteredTrainingRequests.filter((f: TrainingRequestModel) => f.training_type?.type == "lesson").length}
                        </Badge>,
                    ]}
                    type={"underline"}>
                    <Table
                        paginate
                        paginationPerPage={15}
                        className={"mt-5"}
                        columns={columns}
                        data={filteredTrainingRequests.filter((f: TrainingRequestModel) => f.training_type?.type != "lesson")}
                        loading={loading}
                    />
                    <Table
                        paginate
                        paginationPerPage={15}
                        className={"mt-5"}
                        columns={columns}
                        data={filteredTrainingRequests.filter((f: TrainingRequestModel) => f.training_type?.type == "lesson")}
                        loading={loading}
                    />
                </Tabs>
            </Card>
        </>
    );
}
