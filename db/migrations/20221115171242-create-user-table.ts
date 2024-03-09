import {DataType} from "sequelize-typescript";
import {QueryInterface, Sequelize} from "sequelize";

//TODO: Check relationships (explicitly on delete and on update). These should not all be cascade!
export const USER_TABLE_NAME = "users";

export const USER_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
    },
    first_name: {
        type: DataType.STRING(40),
        allowNull: false,
    },
    last_name: {
        type: DataType.STRING(40),
        allowNull: false,
    },
    email: {
        type: DataType.STRING,
        allowNull: false,
    },
    access_token: {
        type: DataType.TEXT,
    },
    refresh_token: {
        type: DataType.TEXT,
    },

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.createTable("users", USER_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface, sequelize: Sequelize) {
        await queryInterface.dropTable("users");
    }
}
