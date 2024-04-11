import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const USER_DATA_TABLE_NAME = "user_data";

export const USER_DATA_TABLE_ATTRIBUTES = {
    user_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    rating_atc: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    rating_pilot: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    country_code: DataType.STRING(10),
    country_name: DataType.STRING,
    region_code: DataType.STRING(10),
    region_name: DataType.STRING,
    division_code: DataType.STRING(10),
    division_name: DataType.STRING,
    subdivision_code: DataType.STRING(10),
    subdivision_name: DataType.STRING,

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(USER_DATA_TABLE_NAME, USER_DATA_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(USER_DATA_TABLE_NAME);
    },
};
