import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const TRAINING_LOG_TEMPLATES_TABLE_NAME = "training_log_templates";

export const TRAINING_LOG_TEMPLATES_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING,
        allowNull: false,
    },
    content: {
        type: DataType.JSON,
        allowNull: false,
        defaultValue: [],
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_LOG_TEMPLATES_TABLE_NAME, TRAINING_LOG_TEMPLATES_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_LOG_TEMPLATES_TABLE_NAME);
    },
};
