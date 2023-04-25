const { DataType } = require("sequelize-typescript");

const ExecuteWhenEnum = ["on_complete", "on_enrolment"];

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
    course_id: {
        type: DataType.INTEGER,
        comment: "Course ID.",
        allowNull: false,
        references: {
            model: "courses",
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
        await queryInterface.createTable("actions_belong_to_courses", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("actions_belong_to_courses");
    },

    DataModelAttributes,
};
