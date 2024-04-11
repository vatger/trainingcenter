import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import TCLListTypes from "@/pages/authenticated/training/training-completed-list/_types/TCLList.types";

export function TrainingCompletedListView() {
    const { data, loading } = useApi<TrainingSessionModel[]>({
        url: "/training-session/completed",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Abgeschlossene Trainings"} hideBackLink />

            <Card>
                <Table columns={TCLListTypes.getColumns()} data={data ?? []} loading={loading} />
            </Card>
        </>
    );
}
