import { UserModel } from "@/models/UserModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbCircleMinus } from "react-icons/tb";
import { TableColumn } from "react-data-table-component";
import { Dispatch, useState } from "react";
import { RoleModel } from "@/models/PermissionModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";
import ToastHelper from "@/utils/helper/ToastHelper";

function getColumns(roleData: RoleModel | undefined, setRoleData: Dispatch<RoleModel>, role_id?: string): TableColumn<UserModel>[] {
    const [loading, setLoading] = useState<boolean>(false);

    function removeUser(user: UserModel) {
        if (role_id == null || roleData == null) return;

        setLoading(true);

        const formData = new FormData();
        FormHelper.set(formData, "user_id", user.id);
        FormHelper.set(formData, "role_id", role_id);

        axiosInstance
            .delete("/administration/role/user", {
                data: formData,
            })
            .then(() => {
                const roleD = { ...roleData };
                roleD.users = roleD.users?.filter(u => u.id != user.id);
                setRoleData(roleD);
                ToastHelper.success("Benutzer erfolgreich entfernt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Entfernen des Benutzers");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return [
        {
            name: "ID",
            selector: row => row.id,
        },
        {
            name: "Name",
            selector: row => row.first_name + " " + row.last_name,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        onClick={() => removeUser(row)}
                        variant={"twoTone"}
                        loading={loading}
                        size={SIZE_OPTS.SM}
                        color={COLOR_OPTS.DANGER}
                        icon={<TbCircleMinus size={20} />}>
                        Entfernen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
