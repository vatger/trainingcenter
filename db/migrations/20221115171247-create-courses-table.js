const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
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
        default: true,
    },
    self_enrollment_enabled: {
        type: DataType.BOOLEAN,
        comment: "If true a user can self-enrol in this course",
        allowNull: false,
        default: true,
    },
    initial_training_type: {
        type: DataType.INTEGER,
        comment: "Training Type ID",
        allowNull: false,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    skill_template_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "course_skill_templates",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
    deletedAt: {
        type: DataType.DATE,
        allowNull: true,
        default: null,
    },
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("courses", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("courses");
    },

    DataModelAttributes,
};
