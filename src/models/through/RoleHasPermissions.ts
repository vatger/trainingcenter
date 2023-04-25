import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { Permission } from "../Permission";
import { Role } from "../Role";

export class RoleHasPermissions extends Model<InferAttributes<RoleHasPermissions>, InferCreationAttributes<RoleHasPermissions>> {
    //
    // Attributes
    //
    declare permission_id: ForeignKey<Permission["id"]>;
    declare role_id: ForeignKey<Role["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare permissions?: NonAttribute<Permission[]>;

    declare static associations: {
        permissions: Association<RoleHasPermissions, Permission>;
    };
}

RoleHasPermissions.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        permission_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "permissions",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        role_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "role_has_permissions",
        sequelize: sequelize,
    }
);
