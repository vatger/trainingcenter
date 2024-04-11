import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel, UserSoloModel } from "@/models/UserModel";
import { Input } from "@/components/ui/Input/Input";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Separator } from "@/components/ui/Separator/Separator";
import { Select } from "@/components/ui/Select/Select";
import dayjs from "dayjs";
import React, { Dispatch, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbPlaylistAdd, TbTrack, TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { AxiosResponse } from "axios";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";

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
                ToastHelper.success("Solo erfolgreich gelöscht");
                onClose();
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen der Solo");
            })
            .finally(() => setDeletingSolo(false));
    }

    return (
        <form onSubmit={deleteSolo}>
            <Modal
                show={show}
                onClose={onClose}
                title={"Solo Löschen"}
                footer={
                    <Button type={"submit"} loading={deletingSolo} icon={<TbTrash size={20} />} color={COLOR_OPTS.DANGER} variant={"twoTone"}>
                        Löschen
                    </Button>
                }>
                <Input label={"Verbrauchte Tage der Solo"} labelSmall disabled value={user?.user_solo?.solo_used.toString()} />

                <Separator />

                <p>
                    Bist du sicher, dass du die Solo von{" "}
                    <strong>
                        {user?.first_name} {user?.last_name}
                    </strong>{" "}
                    löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden und hat zur Folge, dass eine neue Solo angelegt werden kann.
                </p>
            </Modal>
        </form>
    );
}
