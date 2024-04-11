import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { useState } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import { Table } from "@/components/ui/Table/Table";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import MGVEndorsementGroupsTypes from "@/pages/administration/lm/mentor-group/view/_types/MGVEndorsementGroups.types";

export function MGVEndorsementGroupsSubpage({ mentorGroupID }: { mentorGroupID?: string }) {
    const {
        data: mentorGroupEndorsementGroups,
        loading: loadingMentorGroupEndorsementGroups,
        setData: setMentorGroupEndorsementGroups,
    } = useApi<EndorsementGroupModel[]>({
        url: `/administration/mentor-group/${mentorGroupID}/endorsement-group`,
        method: "get",
    });

    const { data: endorsementGroups, loading: loadingEndorsementGroups } = useApi<EndorsementGroupModel[]>({
        url: "/administration/endorsement-group",
        method: "get",
    });

    const [selectedEndorsementGroup, setSelectedEndorsementGroup] = useState<string | undefined>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    function addEndorsementGroup() {
        setSubmitting(true);

        const endorsementGroup = endorsementGroups?.find(e => e.id == Number(selectedEndorsementGroup));
        if (selectedEndorsementGroup == null || selectedEndorsementGroup == "-1" || endorsementGroup == null || mentorGroupEndorsementGroups == null) {
            setSubmitting(false);
            return;
        }

        axiosInstance
            .post(`/administration/mentor-group/endorsement-group`, {
                mentor_group_id: mentorGroupID,
                endorsement_group_id: selectedEndorsementGroup,
            })
            .then(() => {
                setMentorGroupEndorsementGroups([...mentorGroupEndorsementGroups!, endorsementGroup]);
                ToastHelper.success("Freigabegruppe erfolgreich hinzugefügt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen der Freigabegruppe");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <RenderIf
                truthValue={loadingEndorsementGroups}
                elementTrue={<></>}
                elementFalse={
                    <>
                        <div className={"flex flex-col"}>
                            <Select
                                label={"Freigabegruppe Hinzufügen"}
                                labelSmall
                                disabled={submitting}
                                onChange={v => {
                                    if (v == "-1") {
                                        setSelectedEndorsementGroup(undefined);
                                    }

                                    setSelectedEndorsementGroup(v);
                                }}
                                value={selectedEndorsementGroup ?? "-1"}>
                                <option value={"-1"}>Freigabegruppe Auswählen</option>

                                <MapArray
                                    data={
                                        endorsementGroups?.filter(m => {
                                            return !mentorGroupEndorsementGroups?.find(mG => mG.id == m.id);
                                        }) ?? []
                                    }
                                    mapFunction={(mentorGroup: MentorGroupModel, index) => {
                                        return (
                                            <option key={index} value={mentorGroup.id}>
                                                {mentorGroup.name}
                                            </option>
                                        );
                                    }}
                                />
                            </Select>
                        </div>

                        <Button
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            className={"mt-5"}
                            icon={<TbPlus size={20} />}
                            loading={submitting}
                            size={SIZE_OPTS.SM}
                            onClick={() => addEndorsementGroup()}>
                            Hinzufügen
                        </Button>
                    </>
                }
            />

            <Separator />

            <Table
                columns={MGVEndorsementGroupsTypes.getColumns(mentorGroupID)}
                data={mentorGroupEndorsementGroups ?? []}
                paginate
                loading={loadingMentorGroupEndorsementGroups}
            />
        </>
    );
}
