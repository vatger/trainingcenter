import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "./User";
import { sequelize } from "../core/Sequelize";
import { DataType } from "sequelize-typescript";

export class UserSettings extends Model<InferAttributes<UserSettings>, InferCreationAttributes<UserSettings>> {
    declare user_id: ForeignKey<User["id"]>;
    declare language: "de" | "en";
    declare dark_mode: boolean;
    declare email_notifications_enabled: boolean;

    declare additional_emails: CreationOptional<string[]>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
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
        dark_mode: {
            type: DataType.BOOLEAN,
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
