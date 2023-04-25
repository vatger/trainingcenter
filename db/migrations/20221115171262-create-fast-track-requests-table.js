const { DataType } = require("sequelize-typescript");

/*
    STATUS:
    0 -> Requested, not uploaded to ATSIM
    1 -> Uploaded, Test requested
    2 -> Test failed, request retry
    3 -> Intro done, request rating
    4 -> Request denied
    5 -> Completed with success
 */

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    requested_by_user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    status: {
        type: DataType.INTEGER,
        allowNull: false,
        default: 0,
    },
    rating: {
        type: DataType.INTEGER,
        comment: "0 = S2, 1 = S3",
        allowNull: false,
    },
    file_name: {
        type: DataType.STRING,
        allowNull: false,
    },
    comment: {
        type: DataType.TEXT,
        allowNull: true,
    },
    response: {
        type: DataType.TEXT,
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("fast_track_requests", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("fast_track_requests");
    },

    DataModelAttributes,
};
