import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { Permission } from "./Permission";
import { User } from "./User";
import { ROLE_BELONGS_TO_USER_TABLE_NAME, ROLE_TABLE_ATTRIBUTES } from "../../db/migrations/20221115171263-create-permission-tables";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    //
    // Attributes
    //
    declare name: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>;
    declare permissions?: NonAttribute<Permission[]>;

    declare static associations: {
        users: Association<Role, User>;
        permissions: Association<Role, Permission>;
    };
}

Role.init(ROLE_TABLE_ATTRIBUTES, {
    tableName: ROLE_BELONGS_TO_USER_TABLE_NAME,
    sequelize: sequelize,
});
