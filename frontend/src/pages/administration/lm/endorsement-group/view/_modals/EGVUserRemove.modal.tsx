import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel } from "@/models/UserModel";
import { Button } from "@/components/ui/Button/Button";
import { TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import React, { useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export function EGVUserRemoveModal({
    show,
    onClose,
    onRemoveUser,
    user,
    endorsementGroupID,
}: {
    show: boolean;
    onClose: () => any;
    onRemoveUser: (user: UserModel) => any;
    user?: UserModel;
    endorsementGroupID?: string;
}) {
    const [isRemovingUser, setIsRemovingUser] = useState<boolean>(false);

    function handleRemoveUser() {
        if (user == null) {
            return;
        }

        setIsRemovingUser(true);

        axiosInstance
            .delete(`/administration/endorsement-group/${endorsementGroupID}/users`, {
                data: {
                    user_id: user.id,
                },
            })
            .then(() => {
                ToastHelper.success("Benutzer erfolgreich aus Freigabegruppe entfernt");
                onRemoveUser(user);
                onClose();
            })
            .catch(() => {
                ToastHelper.error("Fehler beim entfernen des Benutzers aus der Freigabegruppe");
            })
            .finally(() => setIsRemovingUser(false));
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            title={"Benutzer Entfernen"}
            footer={
                <Button icon={<TbTrash size={20} />} loading={isRemovingUser} variant={"twoTone"} onClick={handleRemoveUser} color={COLOR_OPTS.DANGER}>
                    Entfernen
                </Button>
            }>
            <p>
                Bist du sicher, dass du den Benutzer{" "}
                <strong>
                    {user?.first_name} {user?.last_name} ({user?.id})
                </strong>{" "}
                aus der Freigabegruppe entfernen möchtest? Damit erlöschen alle Freigaben für die hinterlegten Stationen (sofern nicht durch andere
                Freigabegruppen abgedeckt) für diesen Benutzer.
            </p>
        </Modal>
    );
}
