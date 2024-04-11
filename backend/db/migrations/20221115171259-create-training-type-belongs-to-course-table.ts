import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_NAME = "training_types_belongs_to_courses";

export const TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    training_type_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_types",
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
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_NAME, TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_NAME);
    },
};
