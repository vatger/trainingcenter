const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataType.STRING,
    },
    path: {
        type: DataType.STRING,
    },
    method: {
        type: DataType.STRING(10),
    },
    remote_addr: {
        type: DataType.STRING,
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
