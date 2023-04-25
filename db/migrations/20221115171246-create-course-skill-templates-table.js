const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING,
        allowNull: false,
    },
    content: {
        type: DataType.JSON,
        allowNull: false,
        default: [],
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("course_skill_templates", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("course_skill_templates");
    },

    DataModelAttributes,
};
