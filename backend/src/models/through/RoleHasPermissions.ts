import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { sequelize } from "../../core/Sequelize";
import { Permission } from "../Permission";
import { Role } from "../Role";
import { ROLE_HAS_PERMISSION_TABLE_ATTRIBUTES, ROLE_HAS_PERMISSION_TABLE_NAME } from "../../../db/migrations/20221115171263-create-permission-tables";

export class RoleHasPermissions extends Model<InferAttributes<RoleHasPermissions>, InferCreationAttributes<RoleHasPermissions>> {
    //
    // Attributes
    //
    declare permission_id: ForeignKey<Permission["id"]>;
    declare role_id: ForeignKey<Role["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare permissions?: NonAttribute<Permission[]>;

    declare static associations: {
        permissions: Association<RoleHasPermissions, Permission>;
    };
}

RoleHasPermissions.init(ROLE_HAS_PERMISSION_TABLE_ATTRIBUTES, {
    tableName: ROLE_HAS_PERMISSION_TABLE_NAME,
    sequelize: sequelize,
});
