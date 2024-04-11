import { TableColumn } from "react-data-table-component";
import { TbCheck, TbEdit, TbTrash } from "react-icons/tb";
import { Dispatch, useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import { IUserInMentorGroup } from "@/pages/administration/lm/mentor-group/create/MentorGroupCreate.view";

enum EditType {
    ADMIN,
    COURSE_MANAGEMENT,
}

function getColumns(my_user_id: number | undefined, users: IUserInMentorGroup[], setUsers: Dispatch<IUserInMentorGroup[]>): TableColumn<IUserInMentorGroup>[] {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    function removeUser(user_id: number) {
        if (my_user_id == user_id) return;

        const newUsers = users.filter(u => u.user.id != user_id);
        setUsers(newUsers);
    }

    function updateUser(val: boolean, type: EditType, user_id: number) {
        let newUsers = [...users];
        const usr: IUserInMentorGroup | undefined = users.find(u => u.user.id == user_id);

        if (usr == null) return;

        const idx = users.indexOf(usr);

        switch (type) {
            case EditType.ADMIN:
                newUsers[idx].admin = val;
                break;

            case EditType.COURSE_MANAGEMENT:
                newUsers[idx].can_manage = val;
                break;
        }

        setUsers(newUsers);
    }

    return [
        {
            name: "Id",
            selector: row => row.user.id.toString(),
        },
        {
            name: "Name",
            selector: row => `${row.user.first_name} ${row.user.last_name}`,
        },
        {
            name: "Gruppenadministrator",
            cell: row => {
                if (isEditing && row.user.id != my_user_id)
                    return (
                        <Checkbox
                            disabled={row.user.id == my_user_id}
                            onChange={e => updateUser(e, EditType.ADMIN, row.user.id)}
                            checked={row.admin}></Checkbox>
                    );
                else return row.admin ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
        },
        {
            name: "Kursverwaltung",
            cell: row => {
                if (isEditing && row.user.id != my_user_id)
                    return (
                        <Checkbox
                            disabled={row.user.id == my_user_id}
                            onChange={e => updateUser(e, EditType.COURSE_MANAGEMENT, row.user.id)}
                            checked={row.can_manage}></Checkbox>
                    );
                else return row.can_manage ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
        },
        {
            name: "Aktion",
            cell: row => {
                if (isEditing && row.user.id != my_user_id) {
                    return (
                        <Button
                            variant={"twoTone"}
                            onClick={() => setIsEditing(false)}
                            className={"mr-2"}
                            size={SIZE_OPTS.SM}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbCheck size={20} />}
                        />
                    );
                } else {
                    return (
                        <div className={"flex"}>
                            <Button
                                variant={"twoTone"}
                                onClick={() => setIsEditing(true)}
                                className={"mr-2"}
                                disabled={row.user.id == my_user_id}
                                size={SIZE_OPTS.SM}
                                color={COLOR_OPTS.PRIMARY}
                                icon={<TbEdit size={20} />}
                            />

                            <Button
                                variant={"twoTone"}
                                size={SIZE_OPTS.SM}
                                color={COLOR_OPTS.DANGER}
                                disabled={row.user.id == my_user_id}
                                onClick={() => removeUser(row.user.id)}
                                icon={<TbTrash size={20} />}
                            />
                        </div>
                    );
                }
            },
        },
    ];
}

export default {
    getColumns,
};
