import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const FAST_TRACK_REQUEST_TABLE_NAME = "fast_track_requests";

/*
    STATUS:
    0 -> Requested, not uploaded to ATSIM
    1 -> Uploaded, Test requested
    2 -> Test failed, request retry
    3 -> Intro done, request rating
    4 -> Request denied
    5 -> Completed with success
 */

export const FAST_TRACK_REQUEST_TABLE_ATTRIBUTES = {
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
        defaultValue: 0,
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

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(FAST_TRACK_REQUEST_TABLE_NAME, FAST_TRACK_REQUEST_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(FAST_TRACK_REQUEST_TABLE_NAME);
    },
};
