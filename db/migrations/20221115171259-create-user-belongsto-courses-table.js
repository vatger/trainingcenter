const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    course_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "courses",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    next_training_type: {
        type: DataType.INTEGER,
        allowNull: true,
        default: null,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    skill_set: {
        type: DataType.JSON,
        allowNull: true,
        default: null,
    },
    completed: {
        type: DataType.BOOLEAN,
        allowNull: false,
        default: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("users_belong_to_courses", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("users_belong_to_courses");
    },

    DataModelAttributes,
};
