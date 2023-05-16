import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { Permission } from "../Permission";
import { Role } from "../Role";
import { User } from "../User";

export class RoleBelongsToUsers extends Model<InferAttributes<RoleBelongsToUsers>, InferCreationAttributes<RoleBelongsToUsers>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
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
    declare users?: NonAttribute<Permission[]>;

    declare static associations: {
        permissions: Association<RoleBelongsToUsers, Permission>;
    };
}

RoleBelongsToUsers.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            references: {
                model: "users",
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
        tableName: "role_belongs_to_users",
        sequelize: sequelize,
    }
);
