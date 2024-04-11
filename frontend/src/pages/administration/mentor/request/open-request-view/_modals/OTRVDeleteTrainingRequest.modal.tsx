import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { useState } from "react";
import ToastHelper from "../../../../../../utils/helper/ToastHelper";
import { TbTrash } from "react-icons/tb";
import { axiosInstance } from "@/utils/network/AxiosInstance";

/**
 * Confirms and deletes a training of a specific user.
 * This modal is only executed by mentors (and above).
 * @constructor
 */
export function OTRVDeleteTrainingRequestModal(props: {
    open: boolean;
    onClose: () => any;
    trainingRequest?: TrainingRequestModel;
    onDelete: (tR?: TrainingRequestModel) => any;
}) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function deleteTrainingRequest() {
        setSubmitting(true);
        axiosInstance
            .delete(`/administration/training-request/${props.trainingRequest?.uuid}`)
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
                <Button icon={<TbTrash size={20} />} loading={submitting} color={COLOR_OPTS.DANGER} variant={"twoTone"} onClick={deleteTrainingRequest}>
                    Löschen
                </Button>
            }>
            <p>
                Bist du sicher, dass Du die Trainingsanfrage von{" "}
                <strong>
                    {props.trainingRequest?.user?.first_name} {props.trainingRequest?.user?.last_name} ({props.trainingRequest?.user_id})
                </strong>{" "}
                löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden und der Benutzer muss im Anschluss eine neue Anfrage stellen.
            </p>
        </Modal>
    );
}
