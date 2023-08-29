import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "./User";
import { sequelize } from "../core/Sequelize";
import { DataType } from "sequelize-typescript";

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

UserSettings.init(
    {
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
        language: {
            type: DataType.ENUM("de", "en"),
            allowNull: false,
        },
        additional_emails: {
            type: DataType.JSON(),
            allowNull: true,
        },
        email_notifications_enabled: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "user_settings",
        sequelize: sequelize,
    }
);
