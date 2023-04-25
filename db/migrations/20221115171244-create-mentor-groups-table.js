const { DataType } = require("sequelize-typescript");

const firTypeEnum = ["edww", "edgg", "edmm"];

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of mentor-group. Max length 70 chars",
        allowNull: false,
    },
    fir: {
        type: DataType.ENUM(...firTypeEnum),
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("mentor_groups", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("mentor_groups");
    },

    DataModelAttributes,
};
