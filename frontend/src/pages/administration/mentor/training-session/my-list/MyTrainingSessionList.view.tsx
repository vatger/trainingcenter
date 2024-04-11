import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import MTSLListTypes from "@/pages/administration/mentor/training-session/my-list/_types/MTSLList.types";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";

export function MyTrainingSessionListView() {
    const { data, setData, loading } = useApi<TrainingSessionModel[]>({
        url: "/administration/training-session/my",
        method: "get",
        onLoad: data => {
            setData(
                data.filter(d => {
                    return d.completed;
                })
            );
        },
    });

    return (
        <>
            <PageHeader title={"Meine Trainings"} hideBackLink />

            <Card>
                <Table columns={MTSLListTypes.getColumns()} data={data ?? []} loading={loading} />
            </Card>
        </>
    );
}
