import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const COURSE_TABLE_NAME = "courses";

export const COURSE_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Course Name. Max length 70 chars",
        allowNull: false,
    },
    name_en: {
        type: DataType.STRING(70),
        comment: "Course Name. Max Length 70 chars. English text",
        allowNull: false,
    },
    description: {
        type: DataType.TEXT,
        allowNull: false,
    },
    description_en: {
        type: DataType.TEXT,
        allowNull: false,
    },
    is_active: {
        type: DataType.BOOLEAN,
        comment: "If true then course is visible",
        allowNull: false,
        defaultValue: true,
    },
    self_enrollment_enabled: {
        type: DataType.BOOLEAN,
        comment: "If true a user can self-enrol in this course",
        allowNull: false,
        defaultValue: true,
    },
    initial_training_type: {
        type: DataType.INTEGER,
        comment: "Training Type ID",
        allowNull: true,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    enrol_requirements: {
        type: DataType.JSON,
        allowNull: true,
        default: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    deletedAt: {
        type: DataType.DATE,
        allowNull: true,
        default: null,
    },
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(COURSE_TABLE_NAME, COURSE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(COURSE_TABLE_NAME);
    },
};
