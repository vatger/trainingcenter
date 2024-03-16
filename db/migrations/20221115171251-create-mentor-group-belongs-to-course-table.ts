import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_NAME = "mentor_groups_belong_to_courses";

export const MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_ATTRIBUTES = {
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
        defaultValue: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_NAME, MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_NAME);
    },
};
