const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
    },
    first_name: {
        type: DataType.STRING(40),
        allowNull: false,
    },
    last_name: {
        type: DataType.STRING(40),
        allowNull: false,
    },
    email: {
        type: DataType.STRING,
        allowNull: false,
    },
    access_token: {
        type: DataType.TEXT,
    },
    refresh_token: {
        type: DataType.TEXT,
    },

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", DataModelAttributes);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("users");
    },
};
