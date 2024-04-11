import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const PERMISSION_TABLE_NAME = "permissions";
export const PERMISSION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        allowNull: false,
        unique: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export const ROLE_TABLE_NAME = "roles";
export const ROLE_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        allowNull: false,
        unique: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export const ROLE_HAS_PERMISSION_TABLE_NAME = "role_has_permissions";
export const ROLE_HAS_PERMISSION_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    permission_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "permissions",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    role_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export const ROLE_BELONGS_TO_USER_TABLE_NAME = "role_belongs_to_users";
export const ROLE_BELONGS_TO_USER_TABLE_ATTRIBUTES = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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
    role_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
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
        await queryInterface.createTable(PERMISSION_TABLE_NAME, PERMISSION_TABLE_ATTRIBUTES);
        await queryInterface.createTable(ROLE_TABLE_NAME, ROLE_TABLE_ATTRIBUTES);
        await queryInterface.createTable(ROLE_HAS_PERMISSION_TABLE_NAME, ROLE_HAS_PERMISSION_TABLE_ATTRIBUTES);
        await queryInterface.createTable(ROLE_BELONGS_TO_USER_TABLE_NAME, ROLE_BELONGS_TO_USER_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(PERMISSION_TABLE_NAME);
        await queryInterface.dropTable(ROLE_TABLE_NAME);
        await queryInterface.dropTable(ROLE_HAS_PERMISSION_TABLE_NAME);
        await queryInterface.dropTable(ROLE_BELONGS_TO_USER_TABLE_NAME);
    },
};
