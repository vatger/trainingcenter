const { DataType } = require("sequelize-typescript");

const CourseInformationModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    data: {
        type: DataType.JSON,
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("course_information", CourseInformationModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("course_information");
    },
};
