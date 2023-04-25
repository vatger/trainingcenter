const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataType.INTEGER,
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

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("users_belong_to_mentor_groups", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("users_belong_to_mentor_groups");
    },

    DataModelAttributes,
};
