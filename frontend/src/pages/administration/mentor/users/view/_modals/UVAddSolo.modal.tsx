import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel, UserSoloModel } from "@/models/UserModel";
import { Input } from "@/components/ui/Input/Input";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Separator } from "@/components/ui/Separator/Separator";
import { Select } from "@/components/ui/Select/Select";
import dayjs from "dayjs";
import React, { Dispatch, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbPlaylistAdd, TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { AxiosResponse } from "axios";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";

export function UVAddSoloModal({
    show,
    onClose,
    user,
    setUser,
    endorsementGroups,
}: {
    show: boolean;
    onClose: () => any;
    user?: UserModel;
    setUser: Dispatch<UserModel>;
    endorsementGroups: EndorsementGroupModel[] | undefined;
}) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function addSolo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (user == null) return;
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "trainee_id", user?.id);

        axiosInstance
            .post("/administration/solo", formData)
            .then((res: AxiosResponse) => {
                const data: UserModel = res.data as UserModel;

                setUser({
                    ...user,
                    endorsement_groups: data.endorsement_groups,
                    user_solo: data.user_solo as UserSoloModel,
                });
                ToastHelper.success("Solo erfolgreich erstellt");
                onClose();
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Solophase");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <form onSubmit={addSolo}>
            <Modal
                show={show}
                onClose={onClose}
                title={"Solo Hinzufügen"}
                footer={
                    <Button type={"submit"} loading={submitting} icon={<TbPlaylistAdd size={20} />} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                        Hinzufügen
                    </Button>
                }>
                <Input
                    label={"Aktuelles ATC Rating"}
                    description={"Das aktuelle Rating, welches der Trainee besitzt."}
                    labelSmall
                    disabled
                    value={getAtcRatingCombined(user?.user_data?.rating_atc ?? -1)}
                />

                <Separator />

                <Select
                    label={"Solo Dauer"}
                    labelSmall
                    description={"Dauer der Solophase in Tagen (maximal 30 Tage - dann Verlängerung)"}
                    className={"mt-5"}
                    name={"solo_duration"}
                    required
                    defaultValue={"30"}>
                    <option value="10">10 Tage</option>
                    <option value="20">20 Tage</option>
                    <option value="30">30 Tage</option>
                </Select>

                <Input
                    label={"Solo Start"}
                    description={"Start der Solophase"}
                    className={"mt-5"}
                    name={"solo_start"}
                    labelSmall
                    type={"date"}
                    min={dayjs.utc().format("YYYY-MM-DD")}
                    required
                    value={dayjs.utc().format("YYYY-MM-DD")}
                />

                <Select label={"Freigabegruppe Auswählen"} labelSmall className={"mt-5"} name={"endorsement_group_id"} required defaultValue={"-1"}>
                    <option value="-1" disabled>
                        Freigabegruppe Auswählen
                    </option>
                    <MapArray
                        data={(endorsementGroups ?? []).filter(eg => {
                            return user?.endorsement_groups?.find(ueg => ueg.id == eg.id) == null;
                        })}
                        mapFunction={(e: EndorsementGroupModel, index) => {
                            return (
                                <option key={index} value={e.id}>
                                    {e.name}
                                </option>
                            );
                        }}
                    />
                </Select>
            </Modal>
        </form>
    );
}
