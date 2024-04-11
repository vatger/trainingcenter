import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { sequelize } from "../../core/Sequelize";
import { Permission } from "../Permission";
import { Role } from "../Role";
import { User } from "../User";
import { ROLE_BELONGS_TO_USER_TABLE_ATTRIBUTES, ROLE_BELONGS_TO_USER_TABLE_NAME } from "../../../db/migrations/20221115171263-create-permission-tables";

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

RoleBelongsToUsers.init(ROLE_BELONGS_TO_USER_TABLE_ATTRIBUTES, {
    tableName: ROLE_BELONGS_TO_USER_TABLE_NAME,
    sequelize: sequelize,
});
