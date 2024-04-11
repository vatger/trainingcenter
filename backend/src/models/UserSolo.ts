import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, Association, NonAttribute } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { USER_SOLOS_ATTRIBUTES, USER_SOLOS_TABLE_NAME } from "../../db/migrations/20221115171243-create-user-solos";

export class UserSolo extends Model<InferAttributes<UserSolo>, InferCreationAttributes<UserSolo>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare solo_used: number;
    declare extension_count: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare vateud_solo_id: CreationOptional<number> | null;
    declare created_by: CreationOptional<ForeignKey<User["id"]>>;
    declare current_solo_start: CreationOptional<Date> | null;
    declare current_solo_end: CreationOptional<Date> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association Placeholders
    //
    declare user?: NonAttribute<Association<UserSolo, User>>;
    declare solo_creator?: NonAttribute<Association<UserSolo, User>>;

    declare static associations: {
        user: Association<UserSolo, User>;
        solo_creator: Association<UserSolo, User>;
    };
}

UserSolo.init(USER_SOLOS_ATTRIBUTES, {
    tableName: USER_SOLOS_TABLE_NAME,
    sequelize: sequelize,
});
