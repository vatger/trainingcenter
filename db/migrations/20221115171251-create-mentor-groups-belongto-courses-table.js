const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mentor_group_id: {
        type: DataType.INTEGER,
        comment: "Mentor group ID.",
        allowNull: false,
        references: {
            model: "mentor_groups",
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
    can_edit_course: {
        type: DataType.BOOLEAN,
        comment:
            "If true, ALL users of this mentor group can edit the course assuming the can_manage_course flag is set for the user on users_belong_to_mentor_groups.",
        allowNull: false,
        default: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("mentor_groups_belong_to_courses", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("mentor_groups_belong_to_courses");
    },

    DataModelAttributes,
};
