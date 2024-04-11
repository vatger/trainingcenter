import { Card } from "@/components/ui/Card/Card";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Table } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { PLAddPermissionModal } from "../_modals/PLAddPermission.modal";
import { useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { PermissionModel } from "@/models/PermissionModel";
import { getPermissionTableColumns } from "../_types/PLPermList.types";
import { useState } from "react";
import useApi from "@/utils/hooks/useApi";

export function PLPermListPartial() {
    const navigate = useNavigate();
    const [showAddPermModal, setShowAddPermModal] = useState<boolean>(false);

    const {
        data: permissions,
        setData: setPermissions,
        loading: loadingPermissions,
    } = useApi<PermissionModel[]>({
        url: "/administration/permission",
        method: "get",
    });

    const permissionColumns: TableColumn<PermissionModel>[] = getPermissionTableColumns(navigate);

    return (
        <>
            <Card
                header={"Berechtigungen"}
                className={"mt-5"}
                headerExtra={
                    <Button
                        size={SIZE_OPTS.XS}
                        variant={"twoTone"}
                        onClick={() => setShowAddPermModal(true)}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbPlus size={20} />}>
                        Berechtigung Hinzufügen
                    </Button>
                }
                headerBorder>
                <Table columns={permissionColumns} data={permissions ?? []} loading={loadingPermissions} />
            </Card>

            <PLAddPermissionModal
                show={showAddPermModal}
                onClose={() => setShowAddPermModal(false)}
                onCreate={p => {
                    setPermissions([...(permissions ?? []), p]);
                    setShowAddPermModal(false);
                }}
            />
        </>
    );
}
