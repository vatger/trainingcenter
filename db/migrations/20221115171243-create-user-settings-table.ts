import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const USER_SETTINGS_TABLE_NAME = "user_settings";

const LanguageEnum = ["de", "en"];

export const USER_SETTINGS_TABLE_ATTRIBUTES = {
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
        type: DataType.ENUM(...LanguageEnum),
        allowNull: false,
        defaultValue: "de",
    },
    additional_emails: {
        type: DataType.JSON(),
        allowNull: true,
        defaultValue: [],
    },
    email_notifications_enabled: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(USER_SETTINGS_TABLE_NAME, USER_SETTINGS_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(USER_SETTINGS_TABLE_NAME);
    },
};
