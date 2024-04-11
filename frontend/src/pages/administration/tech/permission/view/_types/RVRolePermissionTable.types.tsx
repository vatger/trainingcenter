import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { PermissionModel, RoleModel } from "@/models/PermissionModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbCircleMinus, TbCirclePlus } from "react-icons/tb";
import { Dispatch, useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";

function getColumns(
    navigate: NavigateFunction,
    permissions: PermissionModel[],
    role: RoleModel | undefined,
    setRole: Dispatch<RoleModel>
): TableColumn<PermissionModel>[] {
    const [loading, setLoading] = useState<{ perm_id: number | undefined }>({ perm_id: undefined });

    function addPermission(row: PermissionModel) {
        if (role == null) return;

        setLoading({ perm_id: row.id });
        const formData = new FormData();
        FormHelper.set(formData, "permission_id", row.id);

        axiosInstance
            .put(`/administration/role/perm/${role.id}`, formData)
            .then(() => {
                const p: PermissionModel = {
                    id: row.id,
                    name: row.name,
                    createdAt: row.createdAt,
                };
                let permissions = role.permissions ?? [];
                permissions.push(p);

                setRole({ ...role, permissions: permissions });
            })
            .catch(() => {
                const permissions = role?.permissions?.filter((p: PermissionModel) => {
                    return p.id != row.id;
                });

                setRole({ ...role, permissions: permissions });
            })
            .finally(() => setLoading({ perm_id: undefined }));
    }

    function removePermission(row: PermissionModel) {
        if (role == null) return;

        setLoading({ perm_id: row.id });
        const formData = new FormData();
        FormHelper.set(formData, "permission_id", row.id);

        axiosInstance
            .delete(`/administration/role/perm/${role.id}`, {
                data: formData,
            })
            .then(() => {
                const permissions = role?.permissions?.filter((p: PermissionModel) => {
                    return p.id != row.id;
                });

                setRole({ ...role, permissions: permissions });
            })
            .catch(() => {
                const p: PermissionModel = {
                    id: row.id,
                    name: row.name,
                    createdAt: row.createdAt,
                };
                let permissions = role.permissions ?? [];
                permissions.push(p);

                setRole({ ...role, permissions: permissions });
            })
            .finally(() => setLoading({ perm_id: undefined }));
    }

    return [
        {
            name: "ID",
            selector: row => row.id,
        },
        {
            name: "Name",
            selector: row => row.name,
        },
        {
            name: "Aktion",
            cell: row => {
                // Try and find permission in the role's permission list. If found, we can remove, else add!
                if (
                    role?.permissions?.find((val: PermissionModel) => {
                        return val.name.toLowerCase() == row.name.toLowerCase();
                    }) == null
                ) {
                    return (
                        <Button
                            variant={"twoTone"}
                            size={SIZE_OPTS.SM}
                            color={COLOR_OPTS.DANGER}
                            icon={<TbCirclePlus size={20} />}
                            disabled={loading.perm_id != null}
                            loading={loading.perm_id == row.id}
                            onClick={() => {
                                addPermission(row);
                            }}>
                            Hinzufügen
                        </Button>
                    );
                } else {
                    return (
                        <Button
                            variant={"twoTone"}
                            size={SIZE_OPTS.SM}
                            color={COLOR_OPTS.SUCCESS}
                            icon={<TbCircleMinus size={20} />}
                            disabled={loading.perm_id != null}
                            loading={loading.perm_id == row.id}
                            onClick={() => {
                                removePermission(row);
                            }}>
                            Entfernen
                        </Button>
                    );
                }
            },
        },
    ];
}

export default {
    getColumns,
};
