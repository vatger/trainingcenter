const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataType.STRING,
        allowNull: true,
    },
    path: {
        type: DataType.STRING,
        allowNull: true,
    },
    method: {
        type: DataType.STRING(10),
        allowNull: true,
    },
    remote_addr: {
        type: DataType.STRING,
        allowNull: true,
    },
    message: {
        type: DataType.TEXT,
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("syslog", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("syslog");
    },

    DataModelAttributes,
};
