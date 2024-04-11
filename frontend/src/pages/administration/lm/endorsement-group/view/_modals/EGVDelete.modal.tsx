import { Modal } from "@/components/ui/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import { useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export function EGVDeleteModal({ id, show, onClose }: { id?: string; show: boolean; onClose: () => any }) {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState<boolean>(false);

    function deleteEndorsementGroup() {
        setSubmitting(true);
        axiosInstance
            .delete(`/administration/endorsement-group/${id}`)
            .then(() => {
                ToastHelper.success("Freigabegruppe erfolgreich gelöscht");
                navigate("/administration/endorsement-group");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim löschen der Freigabegruppe");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <Modal
            show={show}
            title={"Freigabegruppe Löschen"}
            onClose={onClose}
            footer={
                <Button loading={submitting} icon={<TbTrash size={20} />} color={COLOR_OPTS.DANGER} variant={"twoTone"} onClick={deleteEndorsementGroup}>
                    Löschen
                </Button>
            }>
            <p>
                Bist du sicher, dass du die Freigabegruppe löschen möchtest? Mitglieder, die in dieser Freigabegruppe sind, verlieren - sofern nicht durch
                andere Freigabegruppen abgedeckt - ihre Freigaben.
            </p>
        </Modal>
    );
}
