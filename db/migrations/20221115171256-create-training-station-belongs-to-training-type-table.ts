import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME = "training_types_belong_to_training_stations";

export const TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    training_station_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_stations",
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
        await queryInterface.createTable(TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME, TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME);
    },
};
