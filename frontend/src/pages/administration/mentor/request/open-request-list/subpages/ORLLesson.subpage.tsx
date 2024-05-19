import { Table } from "@/components/ui/Table/Table";
import OTRLessonListTypes from "@/pages/administration/mentor/request/open-request-list/_types/OTRLessonList.types";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { useState } from "react";
import { ButtonRow } from "@/components/ui/Button/ButtonRow";
import { ConversionUtils } from "turbocommons-ts";
import { Alert } from "@/components/ui/Alert/Alert";

export function ORLLessonSubpage({ filteredTrainingRequests, loading }: { filteredTrainingRequests: TrainingRequestModel[]; loading: boolean }) {
    const navigate = useNavigate();
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    function toggleSelectedUser(cid: number) {
        if (selectedUsers.includes(cid)) {
            setSelectedUsers(selectedUsers.filter(u => u !== cid));
            return;
        }

        setSelectedUsers([...selectedUsers, cid]);
    }

    return (
        <>
            <Alert type={TYPE_OPTS.INFO} showIcon>
                Eine Lesson kann über mehrere Arten erstellt werden. Zum Einen können auf der linken Seite die Teilnehmer der Lesson ausgewählt und mit dem
                unteren Button "Lesson Erstellen" an die Session-Erstellen Seite übertragen werden. Zum Anderen kann über die Funktion "Ansehen" eine normale
                Session mit einem Benutzer erstellt werden.
            </Alert>

            <Table
                paginate
                paginationPerPage={15}
                className={"mt-5"}
                columns={OTRLessonListTypes.getColumns(navigate, toggleSelectedUser)}
                data={filteredTrainingRequests.filter((f: TrainingRequestModel) => f.training_type?.type == "lesson")}
                loading={loading}
            />

            <ButtonRow>
                <Button
                    className={"mt-5"}
                    type="button"
                    variant="twoTone"
                    color={COLOR_OPTS.PRIMARY}
                    disabled={selectedUsers.length === 0}
                    onClick={() => {
                        const selectedUsersBase64 = ConversionUtils.stringToBase64(JSON.stringify(selectedUsers));

                        const firstRequestUUID = filteredTrainingRequests.find(f => f.user?.id == selectedUsers[0] && f.training_type?.type == "lesson")?.uuid;
                        const requestsByCIDs = filteredTrainingRequests.filter(f => selectedUsers.includes(f.user?.id ?? -1));

                        // Check if every request is requesting the same training type. If this isn't the case, we don't want to pre-populate the create session page
                        if (!requestsByCIDs.every(r => r.training_type_id == requestsByCIDs[0].training_type_id)) {
                            navigate(`/administration/training-session/create?users=${selectedUsersBase64}`);
                            return;
                        }

                        navigate(`/administration/training-session/create?users=${selectedUsersBase64}&request_uuid=${firstRequestUUID}`);
                    }}>
                    Lesson Erstellen ({selectedUsers.length} Teilnehmer)
                </Button>
            </ButtonRow>
        </>
    );
}
