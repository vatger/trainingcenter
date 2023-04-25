const { DataType } = require("sequelize-typescript");

const trainingTypeEnum = ["online", "sim", "cpt", "lesson"];

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of training type (eg. 'Frankfurt Tower Online'). Max length 70 chars",
        allowNull: false,
    },
    type: {
        type: DataType.ENUM(...trainingTypeEnum),
        comment: "Type of Training Type (ie. Sim Session - Sim)",
        default: "Online",
        allowNull: false,
    },
    log_template_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_log_templates",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("training_types", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_types");
    },

    DataModelAttributes,
};
