import { Modal } from "../../../../../components/ui/Modal/Modal";
import { TrainingRequestModel } from "../../../../../models/TrainingRequestModel";
import { Button } from "../../../../../components/ui/Button/Button";
import { COLOR_OPTS } from "../../../../../assets/theme.config";
import { useState } from "react";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { TbTrash } from "react-icons/tb";

export function CAVDeleteTrainingRequestModal(props: {
    open: boolean;
    onClose: () => any;
    trainingRequest?: TrainingRequestModel;
    onDelete: (tR?: TrainingRequestModel) => any;
}) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function deleteTrainingRequest() {
        setSubmitting(true);

        axiosInstance
            .delete("/training-request", {
                data: {
                    uuid: props.trainingRequest?.uuid,
                },
            })
            .then(() => {
                ToastHelper.success("Anfrage erfolgreich gelöscht");
                props.onClose();
                props.onDelete(props.trainingRequest);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen der Anfrage");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <Modal
            show={props.open}
            title={"Trainingsanfrage Löschen"}
            onClose={props.onClose}
            footer={
                <div className={"flex justify-end"}>
                    <Button icon={<TbTrash size={20} />} loading={submitting} color={COLOR_OPTS.DANGER} variant={"twoTone"} onClick={deleteTrainingRequest}>
                        Löschen
                    </Button>
                </div>
            }>
            <p>
                Bist Du sicher, dass Du diese Trainingsanfrage löschen möchtest? Falls Du es Dir irgendwann anders überlegst, fängst Du wieder am Ende der
                Warteliste an und deine Wartezeit verlängert sich entsprechend.
            </p>
        </Modal>
    );
}
