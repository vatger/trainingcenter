import { Table } from "@/components/ui/Table/Table";
import RoleUserTableTypes from "../_types/RVRoleUserTable.types";
import { Dispatch } from "react";
import { RoleModel } from "@/models/PermissionModel";

export function RVRoleUserTablePartial(props: { loading: boolean; roleData: RoleModel | undefined; setRoleData: Dispatch<RoleModel>; role_id?: string }) {
    return (
        <>
            <Table
                loading={props.loading}
                columns={RoleUserTableTypes.getColumns(props.roleData, props.setRoleData, props.role_id)}
                data={props.roleData?.users ?? []}
            />
        </>
    );
}
