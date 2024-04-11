import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel } from "@/models/UserModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import React, { useState } from "react";
import ToastHelper from "../../../../../../utils/helper/ToastHelper";
import { TbTrash } from "react-icons/tb";
import { axiosInstance } from "@/utils/network/AxiosInstance";

type RemoveUserModalPartialProps = {
    show: boolean;
    onClose: (user: UserModel | undefined) => any;
    user?: UserModel;
    courseUUID?: string;
};

export function CVRemoveUserModal({ show, onClose, user, courseUUID }: RemoveUserModalPartialProps) {
    const [removingUser, setRemovingUser] = useState<boolean>(false);

    function handleRemove(user?: UserModel) {
        setRemovingUser(true);

        if (user == null) {
            return;
        }

        axiosInstance
            .delete(`/administration/course/user/${courseUUID}`, {
                data: {
                    user_id: user.id,
                },
            })
            .then(() => {
                ToastHelper.success("Benutzer erfolgreich entfernt");
                onClose(user);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim entfernen des Benutzers");
            })
            .finally(() => {
                setRemovingUser(false);
            });
    }

    return (
        <Modal
            show={show}
            title={"Benutzer entfernen"}
            onClose={() => onClose(undefined)}
            footer={
                <Button icon={<TbTrash size={20} />} loading={removingUser} variant={"twoTone"} onClick={() => handleRemove(user)} color={COLOR_OPTS.DANGER}>
                    Entfernen
                </Button>
            }>
            <p>
                Bist du sicher, dass Du den Benutzer{" "}
                <span className={"font-bold"}>
                    {user?.first_name} {user?.last_name} ({user?.id}){" "}
                </span>
                aus dem Kurs entfernen möchtest?
            </p>
        </Modal>
    );
}
