import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import TrainingOpenRequestListTypes from "./_types/TORLList.types";
import { useNavigate } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";

export function TrainingOpenRequestListView() {
    const navigate = useNavigate();
    const columns = TrainingOpenRequestListTypes.getColumns(navigate);

    const { data: openTrainingRequests, loading } = useApi<TrainingRequestModel[]>({
        url: "/training-request/open",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Offene Trainingsanfragen"} hideBackLink />

            <Card>
                <Table loading={loading} columns={columns} data={openTrainingRequests ?? []} />
            </Card>
        </>
    );
}
