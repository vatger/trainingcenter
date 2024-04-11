import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import PlannedTrainingListTypes from "./_types/TPLList.types";
import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionBelongsToUserModel } from "@/models/TrainingSessionBelongsToUser.model";

export function PlannedTrainingListView() {
    const { data: sessions, loading: loadingSessions } = useApi<TrainingSessionBelongsToUserModel[]>({
        url: "/training-request/planned",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Geplante Trainings"} hideBackLink />

            <Card>
                <Table paginate columns={PlannedTrainingListTypes.getColumns()} data={sessions ?? []} loading={loadingSessions} />
            </Card>
        </>
    );
}
