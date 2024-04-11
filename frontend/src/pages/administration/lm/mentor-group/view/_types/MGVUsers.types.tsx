import { TableColumn } from "react-data-table-component";
import { UserModel } from "@/models/UserModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { Dispatch, useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

function getColumns(users: UserModel[] | undefined, setUsers: Dispatch<UserModel[] | undefined>, mentorGroupID: string | undefined): TableColumn<UserModel>[] {
    const [removingUser, setRemovingUser] = useState<number | undefined>(undefined);

    function removeUser(user_id: number) {
        setRemovingUser(user_id);

        axiosInstance
            .delete("/administration/mentor-group/member", {
                data: {
                    mentor_group_id: mentorGroupID,
                    user_id: user_id,
                },
            })
            .then(() => {
                setUsers(users?.filter(u => u.id != user_id));
                ToastHelper.success("Benutzer erfolgreich entfernt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Entfernen des Benutzers");
            })
            .finally(() => setRemovingUser(undefined));
    }

    return [
        {
            name: "Id",
            selector: row => row.id.toString(),
        },
        {
            name: "Name",
            selector: row => `${row.first_name} ${row.last_name}`,
        },
        {
            name: "Gruppenadministrator",
            cell: row =>
                row.UserBelongToMentorGroups?.group_admin ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>,
        },
        {
            name: "Kursverwaltung",
            cell: row =>
                row.UserBelongToMentorGroups?.can_manage_course ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        variant={"twoTone"}
                        size={SIZE_OPTS.SM}
                        loading={removingUser == row.id}
                        disabled={
                            removingUser != null ||
                            users == null ||
                            (users?.filter(u => u.UserBelongToMentorGroups?.group_admin)?.length <= 1 && row.UserBelongToMentorGroups?.group_admin)
                        }
                        color={COLOR_OPTS.DANGER}
                        onClick={() => removeUser(row.id)}
                        icon={<TbTrash size={20} />}
                    />
                );
            },
        },
    ];
}

export default {
    getColumns,
};
