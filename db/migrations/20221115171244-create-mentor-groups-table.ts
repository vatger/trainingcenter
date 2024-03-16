import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

const firTypeEnum = ["edww", "edgg", "edmm"];

export const MENTOR_GROUPS_TABLE_NAME = "mentor_groups";

export const MENTOR_GROUPS_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of mentor-group. Max length 70 chars",
        allowNull: false,
    },
    fir: {
        type: DataType.ENUM(...firTypeEnum),
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(MENTOR_GROUPS_TABLE_NAME, MENTOR_GROUPS_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(MENTOR_GROUPS_TABLE_NAME);
    },
};
