import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel } from "@/models/UserModel";
import { Separator } from "@/components/ui/Separator/Separator";
import React, { Dispatch, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export function UVDeleteSoloModal({ show, onClose, user, setUser }: { show: boolean; onClose: () => any; user?: UserModel; setUser: Dispatch<UserModel> }) {
    const [deletingSolo, setDeletingSolo] = useState<boolean>(false);

    function deleteSolo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (user == null || user.user_solo == null) {
            return;
        }
        setDeletingSolo(true);

        axiosInstance
            .delete("/administration/solo", {
                data: {
                    solo_id: user.user_solo.id,
                    trainee_id: user.id,
                },
            })
            .then(res => {
                const data: UserModel = res.data as UserModel;

                setUser({
                    ...user,
                    user_solo: undefined,
                    endorsement_groups: data.endorsement_groups,
                });
                ToastHelper.success("Freigabe erfolgreich gelöscht");
                onClose();
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen der Freigabe");
            })
            .finally(() => setDeletingSolo(false));
    }

    return (
        <form onSubmit={deleteSolo}>
            <Modal
                show={show}
                onClose={onClose}
                title={"Freigabe Löschen"}
                footer={
                    <Button type={"submit"} loading={deletingSolo} icon={<TbTrash size={20} />} color={COLOR_OPTS.DANGER} variant={"twoTone"}>
                        Löschen
                    </Button>
                }>
                <Separator />

                <p>
                    Bist du sicher, dass du die Freigabe von{" "}
                    <strong>
                        {user?.first_name} {user?.last_name}
                    </strong>{" "}
                    löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
            </Modal>
        </form>
    );
}
