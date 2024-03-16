import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";
import { CPT_SESSION_TABLE_NAME } from "./20221115171252-create-cpt-session-table";

export const TRAINING_SESSION_TABLE_NAME = "training_sessions";

export const TRAINING_SESSION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    completed: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    mentor_id: {
        type: DataType.INTEGER,
        allowNull: true, // Null for CPTs!
        references: {
            model: "users",
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
    date: {
        type: DataType.DATE,
        allowNull: true,
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
    cpt_session_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: CPT_SESSION_TABLE_NAME,
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(TRAINING_SESSION_TABLE_NAME, TRAINING_SESSION_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_SESSION_TABLE_NAME);
    },
};
