import Logger, { LogLevels } from "../../utility/Logger";
import { Role } from "../Role";
import { RoleHasPermissions } from "../through/RoleHasPermissions";
import { Permission } from "../Permission";

export function registerRoleAssociations() {
    //
    // Role -> Permissions.txt
    //
    Role.belongsToMany(Permission, {
        as: "permissions",
        through: RoleHasPermissions,
        foreignKey: "role_id",
        otherKey: "permission_id",
    });

    //
    // Permissions.txt -> Role
    //
    Permission.belongsToMany(Role, {
        as: "roles",
        through: RoleHasPermissions,
        foreignKey: "permission_id",
        otherKey: "role_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[RoleAssociations]");
}
