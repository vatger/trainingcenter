import { Card } from "@/components/ui/Card/Card";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Table } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { TableColumn } from "react-data-table-component";
import { RoleModel } from "@/models/PermissionModel";
import RoleListTypes from "../_types/PLRoleList.types";
import { useNavigate } from "react-router-dom";
import { NetworkError } from "@/components/errors/NetworkError";
import { RenderIf } from "@/components/conditionals/RenderIf";
import useApi from "@/utils/hooks/useApi";
import { PLAddRoleModal } from "@/pages/administration/tech/permission/list/_modals/PLAddRole.modal";
import { useState } from "react";

export function PLRoleListPartial() {
    const {
        data: roles,
        setData: setRoles,
        loading,
        loadingError,
    } = useApi<RoleModel[]>({
        url: "/administration/role",
        method: "get",
    });

    const navigate = useNavigate();
    const roleColumns: (TableColumn<RoleModel> & { searchable?: boolean })[] = RoleListTypes.getTableColumn(navigate);
    const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);

    return (
        <>
            <Card
                header={"Rollen"}
                headerExtra={
                    <Button
                        variant={"twoTone"}
                        onClick={() => setShowAddRoleModal(true)}
                        size={SIZE_OPTS.XS}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbPlus size={20} />}>
                        Rolle Hinzufügen
                    </Button>
                }
                headerBorder>
                <RenderIf
                    truthValue={loadingError != null}
                    elementTrue={<NetworkError closeable={false} error={loadingError} />}
                    elementFalse={
                        <>
                            <Table columns={roleColumns} data={roles ?? []} loading={loading} />
                        </>
                    }
                />
            </Card>

            <PLAddRoleModal
                show={showAddRoleModal}
                onClose={() => setShowAddRoleModal(false)}
                onCreate={role => {
                    setRoles([...(roles ?? []), role]);
                    setShowAddRoleModal(false);
                }}
            />
        </>
    );
}
