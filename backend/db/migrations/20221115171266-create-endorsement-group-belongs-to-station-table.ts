import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_NAME = "endorsement_group_belongs_to_stations";

export const ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    endorsement_group_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "endorsement_groups",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    station_id: {
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
        await queryInterface.createTable(ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_NAME, ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_NAME);
    },
};
