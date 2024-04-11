import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const TRAINING_SESSION_BELONGS_TO_USER_TABLE_NAME = "training_session_belongs_to_users";

export const TRAINING_SESSION_BELONGS_TO_USER_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    training_session_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_sessions",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
    log_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_logs",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    passed: {
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_SESSION_BELONGS_TO_USER_TABLE_NAME, TRAINING_SESSION_BELONGS_TO_USER_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_SESSION_BELONGS_TO_USER_TABLE_NAME);
    },
};
