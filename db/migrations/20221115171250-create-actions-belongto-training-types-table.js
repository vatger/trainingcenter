const { DataType } = require("sequelize-typescript");

const ExecuteWhenEnum = ["on_complete", "on_session_planned"];

const DataModelAttributes = {
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
        type: DataType.ENUM(...ExecuteWhenEnum),
        comment: "Defines when to execute the linked action. If this is a requirement, then execute_when is null!",
        allowNull: true,
        default: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("actions_belong_to_training_types", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("actions_belong_to_training_types");
    },

    DataModelAttributes,
};
