import { DataType } from "sequelize-typescript";
import { QueryInterface, Sequelize } from "sequelize";
import { TRAINING_STATIONS_ATTRIBUTES, TRAINING_STATIONS_TABLE_NAME } from "./20221115171252-create-training-stations-table";

export const USER_SOLOS_TABLE_NAME = "user_solos";

export const USER_SOLOS_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vateud_solo_id: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    user_id: {
        unique: true,
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    created_by: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    solo_used: {
        type: DataType.INTEGER,
        default: 0,
        allowNull: false,
    },
    extension_count: {
        type: DataType.INTEGER,
        default: 0,
        allowNull: false,
    },
    current_solo_start: {
        type: DataType.DATE,
        allowNull: true,
    },
    current_solo_end: {
        type: DataType.DATE,
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.createTable(USER_SOLOS_TABLE_NAME, USER_SOLOS_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.dropTable(TRAINING_STATIONS_TABLE_NAME);
    },
};
