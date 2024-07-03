import { DataType } from "sequelize-typescript";
import { NonAttribute, QueryInterface, VIRTUAL } from "sequelize";
import { TrainingRequest } from "../../src/models/TrainingRequest";
import { TrainingStation } from "../../src/models/TrainingStation";

export const TRAINING_REQUEST_TABLE_STATUS_TYPES = ["requested", "planned", "cancelled", "completed"] as const;

export const TRAINING_REQUEST_TABLE_NAME = "training_requests";

export const TRAINING_REQUEST_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
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
    training_type_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
    training_station_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_stations",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    comment: {
        type: DataType.TEXT,
        allowNull: true,
    },
    status: {
        type: DataType.ENUM(...TRAINING_REQUEST_TABLE_STATUS_TYPES),
        allowNull: false,
        defaultValue: "requested",
    },
    expires: {
        type: DataType.DATE,
        allowNull: false,
    },
    training_session_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_sessions",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_REQUEST_TABLE_NAME, TRAINING_REQUEST_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_REQUEST_TABLE_NAME);
    },
};
