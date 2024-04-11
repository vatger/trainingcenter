import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import MTLListTypes from "@/pages/administration/mentor/training-session/planned-list/_types/MTLList.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MTLDeleteSessionModal } from "@/pages/administration/mentor/training-session/planned-list/_modals/MTLDeleteSession.modal";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import useApi from "@/utils/hooks/useApi";

export function MentorTrainingListView() {
    const navigate = useNavigate();

    // Get a list of planned training sessions
    const {
        data: trainingSessions,
        setData: setTrainingSessions,
        loading,
    } = useApi<TrainingSessionModel[]>({
        url: "/administration/training-session/planned",
        method: "get",
    });

    const [selectedTrainingSession, setSelectedTrainingSession] = useState<TrainingSessionModel | undefined>(undefined);
    const [showDeleteSessionModal, setShowDeleteSessionModal] = useState<boolean>(false);

    return (
        <>
            <PageHeader title={"Geplante Trainings"} hideBackLink />

            <Card>
                <Table
                    paginate
                    columns={MTLListTypes.getColumns(navigate, setSelectedTrainingSession, setShowDeleteSessionModal)}
                    data={trainingSessions ?? []}
                    loading={loading}
                />
            </Card>

            <MTLDeleteSessionModal
                show={showDeleteSessionModal}
                selectedTrainingSession={selectedTrainingSession}
                onClose={() => {
                    setShowDeleteSessionModal(false);
                    setSelectedTrainingSession(undefined);
                }}
                onSubmit={training => {
                    const newSessions = trainingSessions?.filter(trainingSession => trainingSession.id != training.id);
                    if (newSessions != null) {
                        setTrainingSessions(newSessions);
                    }
                }}
            />
        </>
    );
}
