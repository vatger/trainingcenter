import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const SYSLOG_TABLE_NAME = "syslog";

export const SYSLOG_TABLE_ATTRIBUTES = {
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

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(SYSLOG_TABLE_NAME, SYSLOG_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(SYSLOG_TABLE_NAME);
    },
};
