import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarTime, TbEdit, TbId } from "react-icons/tb";
import dayjs from "dayjs";
import { CommonRegexp, Config } from "@/core/Config";
import React, { FormEvent, useState } from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { EGVSettingsSkeleton } from "@/pages/administration/lm/endorsement-group/view/_skeletons/EGVSettings.skeleton";

export function EGVSettingsSubpage() {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {
        loading: loadingEndorsementGroup,
        data: endorsementGroup,
        setData: setEndorsementGroup,
    } = useApi<EndorsementGroupModel>({
        url: `/administration/endorsement-group/${id}`,
        method: "get",
    });

    function updateEndorsementGroup(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const data = FormHelper.getEntries(e.target);

        axiosInstance
            .patch(`/administration/endorsement-group/${id}`, data)
            .then(() => {
                setEndorsementGroup({ ...endorsementGroup!, updatedAt: new Date() });
                ToastHelper.success("Freigabegruppe erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Aktualisieren der Freigabegruppe");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <RenderIf
            truthValue={loadingEndorsementGroup}
            elementTrue={<EGVSettingsSkeleton />}
            elementFalse={
                <>
                    <Input
                        labelSmall
                        label={"Zuletzt Aktualisiert"}
                        className={"flex flex-col"}
                        disabled
                        preIcon={<TbCalendarTime size={20} />}
                        value={dayjs.utc(endorsementGroup?.updatedAt).format(Config.DATETIME_FORMAT)}
                    />

                    <Separator />

                    <form onSubmit={updateEndorsementGroup}>
                        <Input
                            labelSmall
                            name={"name"}
                            description={"Name der Freigabegruppe"}
                            required
                            regex={CommonRegexp.NOT_EMPTY}
                            regexMatchEmpty
                            label={"Name"}
                            className={"flex flex-col"}
                            preIcon={<TbId size={20} />}
                            value={endorsementGroup?.name}
                        />

                        <Separator />

                        <Button type={"submit"} loading={isSubmitting} icon={<TbEdit size={20} />} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                            {isSubmitting ? <>Änderungen werden gespeichert</> : <>Änderungen Speichern</>}
                        </Button>
                    </form>
                </>
            }
        />
    );
}
