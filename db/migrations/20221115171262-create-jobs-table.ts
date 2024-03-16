import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const JOBS_TABLE_NAME = "jobs";

export const JOBS_TABLE_STATUS_TYPES = ["queued", "failed", "completed"] as const;

export const JOBS_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    job_type: {
        type: DataType.STRING,
    },
    payload: {
        type: DataType.JSON,
        comment: "Payload for the job, includes json data for the job to execute",
    },
    attempts: {
        type: DataType.TINYINT({ unsigned: true }),
        allowNull: false,
        defaultValue: 0,
    },
    last_executed: {
        type: DataType.DATE,
    },
    status: {
        type: DataType.ENUM(...JOBS_TABLE_STATUS_TYPES),
        defaultValue: "queued",
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(JOBS_TABLE_NAME, JOBS_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(JOBS_TABLE_NAME);
    },
};
