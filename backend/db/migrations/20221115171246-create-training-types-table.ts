import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const TRAINING_TYPES_TABLE_TYPES = ["online", "sim", "cpt", "lesson"] as const;

export const TRAINING_TYPES_TABLE_NAME = "training_types";

export const TRAINING_TYPES_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of training type (eg. 'Frankfurt Tower Online'). Max length 70 chars",
        allowNull: false,
    },
    type: {
        type: DataType.ENUM(...TRAINING_TYPES_TABLE_TYPES),
        comment: "Type of Training Type (ie. Sim Session - Sim)",
        defaultValue: "Online",
        allowNull: false,
    },
    log_template_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_log_templates",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_TYPES_TABLE_NAME, TRAINING_TYPES_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_TYPES_TABLE_NAME);
    },
};
