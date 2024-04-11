import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_EXECUTE_WHEN_TYPES = ["on_complete", "on_session_planned"] as const;

export const ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME = "actions_belong_to_training_types";

export const ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    action_id: {
        type: DataType.INTEGER,
        comment: "Action-/Requirement ID.",
        allowNull: false,
        references: {
            model: "actions_requirements",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    training_type_id: {
        type: DataType.INTEGER,
        comment: "Training Type ID.",
        allowNull: false,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    execute_when: {
        type: DataType.ENUM(...ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_EXECUTE_WHEN_TYPES),
        comment: "Defines when to execute the linked action. If this is a requirement, then execute_when is null!",
        allowNull: true,
        default: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME, ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME);
    },
};
