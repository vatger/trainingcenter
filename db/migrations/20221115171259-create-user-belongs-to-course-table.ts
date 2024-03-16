import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const USER_BELONGS_TO_COURSE_TABLE_NAME = "users_belong_to_courses";

export const USER_BELONGS_TO_COURSE_TABLE_ATTRIBUTES = {
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
        onDelete: "set null",
    },
    completed: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(USER_BELONGS_TO_COURSE_TABLE_NAME, USER_BELONGS_TO_COURSE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(USER_BELONGS_TO_COURSE_TABLE_NAME);
    },
};
