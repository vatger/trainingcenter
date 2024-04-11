import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const USER_SESSION_TABLE_NAME = "user_session";
export const USER_SESSION_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    browser_uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    client: {
        type: DataType.STRING(100),
        allowNull: true,
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
    expires_at: {
        type: DataType.DATE,
        allowNull: false,
    },
    expires_latest: {
        type: DataType.DATE,
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(USER_SESSION_TABLE_NAME, USER_SESSION_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(USER_SESSION_TABLE_NAME);
    },
};
