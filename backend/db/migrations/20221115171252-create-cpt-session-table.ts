import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const CPT_SESSION_TABLE_NAME = "cpt_sessions";

export const CPT_SESSION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    examiner_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    atsim_passed: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    log_file_name: {
        type: DataType.STRING,
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(CPT_SESSION_TABLE_NAME, CPT_SESSION_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(CPT_SESSION_TABLE_NAME);
    },
};
