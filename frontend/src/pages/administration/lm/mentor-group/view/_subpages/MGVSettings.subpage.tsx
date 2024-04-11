import { Input } from "@/components/ui/Input/Input";
import { TbEdit, TbId, TbMap2 } from "react-icons/tb";
import { Select } from "@/components/ui/Select/Select";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import React, { FormEvent, useState } from "react";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import useApi from "@/utils/hooks/useApi";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CommonRegexp } from "@/core/Config";
import { MGVSettingsSkeleton } from "@/pages/administration/lm/mentor-group/view/_skeletons/MGVSettings.skeleton";

export function MGVSettingsSubpage({ mentorGroupID }: { mentorGroupID: string | undefined }) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data: mentorGroup, loading: loadingMentorGroup } = useApi<MentorGroupModel>({
        url: `/administration/mentor-group/${mentorGroupID}`,
        method: "get",
    });

    function update(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "mentor_group_id", mentorGroup?.id);

        axiosInstance
            .patch("/administration/mentor-group", formData)
            .then(() => {
                ToastHelper.success("Mentorengruppe erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Aktualisieren der Mentorengruppe");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <RenderIf
            truthValue={loadingMentorGroup}
            elementTrue={<MGVSettingsSkeleton />}
            elementFalse={
                <form onSubmit={update}>
                    <Input
                        name={"name"}
                        type={"text"}
                        maxLength={70}
                        description={"Name der Mentorengruppe"}
                        labelSmall
                        placeholder={"Frankfurt Tower Mentoren"}
                        label={"Name"}
                        required
                        regex={CommonRegexp.NOT_EMPTY}
                        regexMatchEmpty
                        regexCheckInitial
                        value={mentorGroup?.name}
                        preIcon={<TbId size={20} />}
                    />

                    <Select
                        name={"fir"}
                        label={"FIR"}
                        preIcon={<TbMap2 size={20} />}
                        className={"mt-5"}
                        description={"FIR der Mentorengruppe"}
                        labelSmall
                        defaultValue={mentorGroup?.fir?.toLowerCase() ?? ""}>
                        <option value={"none"}>N/A</option>
                        <option value={"edww"}>EDWW</option>
                        <option value={"edgg"}>EDGG</option>
                        <option value={"edmm"}>EDMM</option>
                    </Select>

                    <Separator />

                    <Button type={"submit"} loading={submitting} icon={<TbEdit size={20} />} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                        Änderungen Speichern
                    </Button>
                </form>
            }
        />
    );
}
