import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const USER_BELONGS_TO_MENTOR_GROUP_TABLE_NAME = "users_belong_to_mentor_groups";

export const USER_BELONGS_TO_MENTOR_GROUP_TABLE_ATTRIBUTES = {
    user_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        comment: "User ID (CID)",
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    group_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        comment: "Mentor-Group ID",
        allowNull: false,
        references: {
            model: "mentor_groups",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    group_admin: {
        type: DataType.BOOLEAN,
        comment: "If true, the member can edit this mentor group's information such as name, members, etc.",
        allowNull: false,
    },
    can_manage_course: {
        type: DataType.BOOLEAN,
        comment:
            "If true, the member can edit courses associated to this mentor group assuming the can_edit_course flag is set on mentor_groups_belong_to_courses. This is to allow multiple mentor groups 'owning' a course, but only one being able to edit the courses. Especially for LM / Mentor of an area/airport.",
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(USER_BELONGS_TO_MENTOR_GROUP_TABLE_NAME, USER_BELONGS_TO_MENTOR_GROUP_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(USER_BELONGS_TO_MENTOR_GROUP_TABLE_NAME);
    },
};
