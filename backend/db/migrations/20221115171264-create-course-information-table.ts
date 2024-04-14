import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const COURSE_INFORMATION_TABLE = "course_information";

export const COURSE_INFORMATION_TABLE_ATTRIBUTES = {
    course_id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "courses",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    data: {
        type: DataType.JSON,
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(COURSE_INFORMATION_TABLE, COURSE_INFORMATION_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(COURSE_INFORMATION_TABLE);
    },
};
