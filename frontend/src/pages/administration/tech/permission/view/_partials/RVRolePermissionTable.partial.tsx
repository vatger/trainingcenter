import { TableColumn } from "react-data-table-component";
import { PermissionModel, RoleModel } from "../../../../../../models/PermissionModel";
import RolePermissionTableTypes from "../_types/RVRolePermissionTable.types";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../../../../components/ui/Table/Table";
import { Dispatch } from "react";

export function RVRolePermissionTablePartial(props: {
    loading: boolean;
    permissions: PermissionModel[];
    role: RoleModel | undefined;
    setRole: Dispatch<RoleModel>;
}) {
    const navigate = useNavigate();

    const rolePermissionColumns: TableColumn<PermissionModel>[] = RolePermissionTableTypes.getColumns(navigate, props.permissions, props.role, props.setRole);

    return <Table loading={props.loading} columns={rolePermissionColumns} data={props.permissions} />;
}
