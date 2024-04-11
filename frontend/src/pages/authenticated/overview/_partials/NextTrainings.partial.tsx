import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import NTTypes from "@/pages/authenticated/overview/_types/NT.types";

interface NextTrainingT {
    upcomingSessions?: TrainingSessionModel[];
    loading: boolean;
}

export function NextTrainingsPartial(props: NextTrainingT) {
    return (
        <Card header={"Anstehende Trainings"} headerBorder>
            <Table columns={NTTypes.getColumns()} data={props.upcomingSessions ?? []} loading={props.loading} />
        </Card>
    );
}
