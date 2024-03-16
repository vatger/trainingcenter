import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const ACTION_REQUIREMENTS_TABLE_TYPES = ["action", "requirement"] as const;

export const ACTION_REQUIREMENTS_TABLE_NAME = "actions_requirements";

export const ACTION_REQUIREMENTS_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of Action-/Requirements. Max length 70 chars",
        allowNull: false,
    },
    action: {
        type: DataType.JSON,
        comment: "Action-Array, including string array of automated actions",
        defaultValue: [],
        allowNull: false,
    },
    type: {
        type: DataType.ENUM(...ACTION_REQUIREMENTS_TABLE_TYPES),
        allowNull: false,
        defaultValue: "action",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(ACTION_REQUIREMENTS_TABLE_NAME, ACTION_REQUIREMENTS_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(ACTION_REQUIREMENTS_TABLE_NAME);
    },
};
