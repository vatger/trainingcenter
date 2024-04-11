import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash, TbUsers } from "react-icons/tb";
import { Badge } from "@/components/ui/Badge/Badge";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import { Dispatch, useState } from "react";
import ToastHelper from "../../../../../../utils/helper/ToastHelper";
import { MentorGroupMembersModalT } from "@/pages/administration/lm/course/view/_subpages/CVMentorgroups.subpage";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(
    courseUUID: string | undefined,
    mentorGroups: MentorGroupModel[],
    setMentorGroups: Dispatch<MentorGroupModel[]>,
    setViewMentorGroupMembersModal: Dispatch<MentorGroupMembersModalT>,
    mentorGroupDropDown: MentorGroupModel[] | undefined,
    setMentorGroupDropDown: Dispatch<MentorGroupModel[]>
): (TableColumn<MentorGroupModel> & { searchable?: boolean })[] {
    const [removingMentorGroupID, setRemovingMentorGroupID] = useState<number | undefined>(undefined);

    function removeMentorGroup(id: number) {
        setRemovingMentorGroupID(id);

        const formData = new FormData();
        FormHelper.set(formData, "mentor_group_id", id);

        axiosInstance
            .delete(`/administration/course/mentor-group/${courseUUID}`, {
                data: formData,
            })
            .then(() => {
                const toBeRemoved = mentorGroups.find(mg => mg.id == id);
                if (toBeRemoved != null && !mentorGroupDropDown?.find(mg => mg.id)) {
                    setMentorGroupDropDown([...(mentorGroupDropDown ?? []), toBeRemoved]);
                }

                const newMentorGroups = mentorGroups.filter((mg: MentorGroupModel) => {
                    return mg.id != id;
                });
                setMentorGroups(newMentorGroups);
                ToastHelper.success("Mentorengruppe erfolgreich entfernt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim entfernen der Mentorengruppe");
            })
            .finally(() => setRemovingMentorGroupID(undefined));
    }

    return [
        {
            name: "Name",
            selector: row => row.name,
            searchable: true,
        },
        {
            name: "Kurs Bearbeitung",
            cell: row => {
                return row?.MentorGroupsBelongsToCourses?.can_edit_course ? (
                    <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge>
                ) : (
                    <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>
                );
            },
        },
        {
            name: "Hinzugefügt Am",
            selector: row => dayjs.utc(row.MentorGroupsBelongsToCourses?.createdAt).format(Config.DATE_FORMAT),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3 ml-2"}
                            size={SIZE_OPTS.SM}
                            onClick={() => {
                                setViewMentorGroupMembersModal({
                                    show: true,
                                    users: row.users ?? [],
                                    mentorGroup: row,
                                });
                            }}
                            disabled={removingMentorGroupID != null}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbUsers size={20} />}
                        />
                        <Button
                            className={"my-3 ml-2"}
                            onClick={() => removeMentorGroup(row.id)}
                            size={SIZE_OPTS.SM}
                            loading={removingMentorGroupID == row.id}
                            disabled={
                                removingMentorGroupID != null ||
                                (mentorGroups.filter(mg => mg.MentorGroupsBelongsToCourses?.can_edit_course == true).length <= 1 &&
                                    row.MentorGroupsBelongsToCourses?.can_edit_course == true)
                            }
                            variant={"twoTone"}
                            color={COLOR_OPTS.DANGER}
                            icon={<TbTrash size={20} />}
                        />
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
