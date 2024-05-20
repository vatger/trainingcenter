import { QueryInterface } from "sequelize";

import { DataType } from "sequelize-typescript";

export const ENDORSEMENT_GROUPS_TABLE_NAME = "endorsement_groups";

export const ENDORSEMENT_GROUPS_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        allowNull: false,
    },
    name_vateud: {
        type: DataType.STRING(70),
        allowNull: false,
    },
    tier: {
        type: DataType.SMALLINT,
        allowNull: false,
        defaultValue: 0,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(ENDORSEMENT_GROUPS_TABLE_NAME, ENDORSEMENT_GROUPS_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(ENDORSEMENT_GROUPS_TABLE_NAME);
    },
};
