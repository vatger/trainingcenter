import { TableColumn } from "react-data-table-component";
import { UserModel } from "@/models/UserModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { Dispatch } from "react";

function getColumns(participants: UserModel[], setParticipants: Dispatch<UserModel[]>): TableColumn<UserModel>[] {
    function removeUser(user_id: number) {
        let p = [];
        for (const u of participants) {
            if (u.id != user_id) {
                p.push(u);
            }
        }
        setParticipants(p);
    }

    return [
        {
            name: "CID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: row => row.first_name + " " + row.last_name,
            sortable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button variant={"twoTone"} size={SIZE_OPTS.SM} onClick={() => removeUser(row.id)} color={COLOR_OPTS.DANGER} icon={<TbTrash size={20} />} />
                );
            },
        },
    ];
}

export default {
    getColumns,
};
