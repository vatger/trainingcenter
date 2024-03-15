import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { USER_SESSION_ATTRIBUTES, USER_SESSION_TABLE_NAME } from "../../db/migrations/20221115171243-create-user-session-table";

export class UserSession extends Model<InferAttributes<UserSession>, InferCreationAttributes<UserSession>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare browser_uuid: string;
    declare client: string;
    declare user_id: ForeignKey<User["id"]>;
    declare expires_at: Date;
    declare expires_latest: Date;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    declare user?: NonAttribute<User>;

    declare static associations: {
        user: Association<UserSession, User>;
    };
}

UserSession.init(USER_SESSION_ATTRIBUTES, {
    tableName: USER_SESSION_TABLE_NAME,
    sequelize: sequelize,
});
