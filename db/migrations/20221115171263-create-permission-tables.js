const { DataType } = require("sequelize-typescript");

const PermissionModelAttributes = {
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

const RoleModelAttributes = {
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

const RoleHasPermissionsAttributes = {
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

const RoleBelongsToUserAttributes = {
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

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("permissions", PermissionModelAttributes);
        await queryInterface.createTable("roles", RoleModelAttributes);
        await queryInterface.createTable("role_has_permissions", RoleHasPermissionsAttributes);
        await queryInterface.createTable("role_belongs_to_users", RoleBelongsToUserAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("permissions");
        await queryInterface.dropTable("roles");
        await queryInterface.dropTable("role_has_permissions");
        await queryInterface.dropTable("role_belongs_to_users");
    },
};
