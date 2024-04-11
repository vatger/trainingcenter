import { UserModel } from "@/models/UserModel";
import { Table } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { MentorGroupModel, MentorGroupsBelongsToCourses } from "@/models/MentorGroupModel";
import CourseMentorGroupsListTypes from "../_types/CVMentorGroupsList.types";
import { useState } from "react";
import { CVMentorGroupMembersPartial } from "@/pages/administration/lm/course/view/_partials/CVMentorGroupMembers.partial";
import { Separator } from "@/components/ui/Separator/Separator";
import { Select } from "@/components/ui/Select/Select";
import { TbPlus } from "react-icons/tb";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CVMentorGroupsSkeleton } from "@/pages/administration/lm/course/view/_skeletons/CVMentorGroups.skeleton";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export type MentorGroupMembersModalT = {
    show: boolean;
    users: UserModel[];
    mentorGroup: MentorGroupModel | undefined;
};

export function CVMentorgroupsSubpage({ courseUUID }: { courseUUID: string | undefined }) {
    const {
        data: mentorGroups,
        setData: setMentorGroups,
        loading,
    } = useApi<MentorGroupModel[]>({
        url: `/administration/course/mentor-group/${courseUUID}`,
        method: "get",
    });
    const {
        data: newMentorGroups,
        setData: setNewMentorGroups,
        loading: loadingMentorGroups,
    } = useApi<MentorGroupModel[]>({
        url: "/administration/mentor-group",
        method: "get",
    });
    const [selectedMentorGroup, setSelectedMentorGroup] = useState<string | undefined>(undefined);
    const [selectedMentorGroupEdit, setSelectedMentorGroupEdit] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [viewMentorGroupMembersModal, setViewMentorGroupMembersModal] = useState<MentorGroupMembersModalT>({
        show: false,
        users: [],
        mentorGroup: undefined,
    });

    function addMentorGroup(id?: string) {
        const idNum = Number(id);
        if (id == null || id == "-1" || isNaN(idNum)) {
            return;
        }

        setSubmitting(true);
        let mentorGroup = newMentorGroups?.find(m => m.id == idNum);
        if (mentorGroup == null) {
            setSubmitting(false);
            return;
        }
        mentorGroup.MentorGroupsBelongsToCourses = {} as MentorGroupsBelongsToCourses;
        mentorGroup.MentorGroupsBelongsToCourses.can_edit_course = selectedMentorGroupEdit;

        axiosInstance
            .post(`/administration/course/mentor-group/${courseUUID}`, {
                mentor_group_id: idNum,
                course_uuid: courseUUID,
                can_edit: mentorGroup.MentorGroupsBelongsToCourses.can_edit_course,
            })
            .then(() => {
                if (mentorGroup == null) return;
                setMentorGroups([...(mentorGroups ?? []), mentorGroup]);
                setNewMentorGroups(newMentorGroups?.filter(m => m.id != idNum) ?? []);
                setSelectedMentorGroup(undefined);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen der Mentorengruppe");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <RenderIf
                truthValue={loadingMentorGroups}
                elementTrue={<CVMentorGroupsSkeleton />}
                elementFalse={
                    <>
                        <div className={"flex flex-col"}>
                            <Select
                                label={"Mentorengruppe Hinzufügen"}
                                labelSmall
                                disabled={submitting}
                                onChange={v => {
                                    if (v == "-1") {
                                        setSelectedMentorGroup(undefined);
                                    }

                                    setSelectedMentorGroup(v);
                                }}
                                defaultValue={"-1"}
                                value={selectedMentorGroup ?? "-1"}>
                                <option value={"-1"} disabled>
                                    Mentorengruppe Auswählen
                                </option>

                                <MapArray
                                    data={
                                        newMentorGroups?.filter(m => {
                                            return !mentorGroups?.find(mG => mG.id == m.id);
                                        }) ?? []
                                    }
                                    mapFunction={(mentorGroup: MentorGroupModel, index) => {
                                        return (
                                            <option key={index} value={mentorGroup.id}>
                                                {mentorGroup.name} ({mentorGroup.fir?.toUpperCase()})
                                            </option>
                                        );
                                    }}
                                />
                            </Select>

                            <div className={"mt-3"}>
                                <Checkbox checked={selectedMentorGroupEdit} onChange={setSelectedMentorGroupEdit}>
                                    Kann Kurs bearbeiten?
                                </Checkbox>
                            </div>
                        </div>

                        <Button
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            className={"mt-5"}
                            icon={<TbPlus size={20} />}
                            loading={submitting}
                            size={SIZE_OPTS.SM}
                            onClick={() => addMentorGroup(selectedMentorGroup)}>
                            Hinzufügen
                        </Button>
                    </>
                }
            />

            <Separator />

            <Table
                columns={CourseMentorGroupsListTypes.getColumns(
                    courseUUID,
                    mentorGroups ?? [],
                    setMentorGroups,
                    setViewMentorGroupMembersModal,
                    newMentorGroups,
                    setNewMentorGroups
                )}
                data={mentorGroups ?? []}
                paginate
                loading={loading}
            />

            <CVMentorGroupMembersPartial
                users={viewMentorGroupMembersModal.users}
                mentorGroup={viewMentorGroupMembersModal.mentorGroup}
                show={viewMentorGroupMembersModal.show}
                onClose={() => setViewMentorGroupMembersModal({ ...viewMentorGroupMembersModal, show: false })}
            />
        </>
    );
}
