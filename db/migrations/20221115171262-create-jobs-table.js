const { DataType } = require("sequelize-typescript");

const jobStatusEnum = ["queued", "running", "completed"];
const jobTypeEnum = ["email"];

const DataModelAttributes = {
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
        type: DataType.ENUM(...jobTypeEnum),
    },
    payload: {
        type: DataType.JSON,
        comment: "Payload for the job, includes json data for the job to execute",
    },
    attempts: {
        type: DataType.TINYINT({ unsigned: true }),
        allowNull: false,
        default: 0,
    },
    available_at: {
        type: DataType.DATE,
    },
    last_executed: {
        type: DataType.DATE,
    },
    status: {
        type: DataType.ENUM(...jobStatusEnum),
        default: "queued",
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("jobs", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("jobs");
    },

    DataModelAttributes,
};
