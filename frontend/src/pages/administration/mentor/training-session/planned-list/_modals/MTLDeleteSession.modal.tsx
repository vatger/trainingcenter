import { Modal } from "@/components/ui/Modal/Modal";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import { useState } from "react";
import ToastHelper from "@/utils/helper/ToastHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";

export function MTLDeleteSessionModal({
    show,
    onClose,
    onSubmit,
    selectedTrainingSession,
}: {
    show: boolean;
    onClose: () => any;
    onSubmit: (training: TrainingSessionModel) => any;
    selectedTrainingSession?: TrainingSessionModel;
}) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function deleteSession() {
        if (selectedTrainingSession == null) return;

        setSubmitting(true);

        const formData = new FormData();
        FormHelper.set(formData, "training_session_id", selectedTrainingSession.id);

        axiosInstance
            .delete("/administration/training-session/training", {
                data: formData,
            })
            .then(() => {
                onSubmit(selectedTrainingSession);
                onClose();
                ToastHelper.success("Session erfolgreich gelöscht");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen der Session");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <Modal
            show={show}
            title={"Training Löschen"}
            onClose={onClose}
            footer={
                <Button loading={submitting} onClick={deleteSession} icon={<TbTrash size={20} />} color={COLOR_OPTS.DANGER} variant={"twoTone"}>
                    Löschen
                </Button>
            }>
            <Input label={"Kurs"} labelSmall disabled readOnly value={selectedTrainingSession?.course?.name} />
            <Input className={"mt-3"} label={"Trainingstyp"} labelSmall disabled readOnly value={selectedTrainingSession?.training_type?.name} />
            <Input
                className={"mt-3"}
                label={"Datum"}
                labelSmall
                disabled
                readOnly
                value={dayjs.utc(selectedTrainingSession?.date).format(Config.DATETIME_FORMAT)}
            />

            <p className={"mt-5"}>
                Bist du sicher, dass du das Training löschen möchtest? Diese Aktion ist unwiderruflich und hat zur Folge, dass die zum Training angemeldeten
                Mitglieder erneut auf der Warteliste platziert werden.
            </p>

            <Separator />
        </Modal>
    );
}
