import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const TRAINING_LOG_TABLE_NAME = "training_logs";

export const TRAINING_LOG_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    content: {
        type: DataType.JSON,
        allowNull: false,
        default: [],
    },
    author_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_LOG_TABLE_NAME, TRAINING_LOG_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_LOG_TABLE_NAME);
    },
};
