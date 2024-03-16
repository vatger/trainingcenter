import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const NOTIFICATION_TABLE_SEVERITY_TYPE = ["default", "info", "success", "danger"] as const;

export const NOTIFICATION_TABLE_NAME = "notifications";

export const NOTIFICATION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    author_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    content_de: {
        type: DataType.TEXT("medium"),
        allowNull: false,
    },
    content_en: {
        type: DataType.TEXT("medium"),
        allowNull: false,
    },
    link: {
        type: DataType.STRING(255),
        allowNull: true,
    },
    icon: {
        type: DataType.STRING(50),
        allowNull: true,
    },
    severity: {
        type: DataType.ENUM(...NOTIFICATION_TABLE_SEVERITY_TYPE),
        allowNull: true,
    },
    read: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(NOTIFICATION_TABLE_NAME, NOTIFICATION_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(NOTIFICATION_TABLE_NAME);
    },
};
