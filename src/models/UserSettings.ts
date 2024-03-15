import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "./User";
import { sequelize } from "../core/Sequelize";
import { USER_SETTINGS_TABLE_ATTRIBUTES, USER_SETTINGS_TABLE_NAME } from "../../db/migrations/20221115171243-create-user-settings-table";

export class UserSettings extends Model<InferAttributes<UserSettings>, InferCreationAttributes<UserSettings>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare language: "de" | "en";
    declare email_notifications_enabled: boolean;

    //
    // Optional Attributes
    //
    declare additional_emails: CreationOptional<string[]> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

UserSettings.init(USER_SETTINGS_TABLE_ATTRIBUTES, {
    tableName: USER_SETTINGS_TABLE_NAME,
    sequelize: sequelize,
});
