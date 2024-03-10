import { DataType } from "sequelize-typescript";
import { QueryInterface, Sequelize } from "sequelize";

export const TRAINING_STATIONS_TABLE_NAME = "training_stations";

export const TRAINING_STATIONS_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    callsign: {
        type: DataType.STRING(15),
        allowNull: false,
        unique: true,
    },
    frequency: {
        type: DataType.FLOAT(6, 3),
        allowNull: false,
        defaultValue: 199.998,
    },
    gcap_training_airport: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    gcap_class: {
        type: DataType.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
    gcap_class_group: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: null,
    },
    s1_twr: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.createTable(TRAINING_STATIONS_TABLE_NAME, TRAINING_STATIONS_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.dropTable(TRAINING_STATIONS_TABLE_NAME);
    },
};
