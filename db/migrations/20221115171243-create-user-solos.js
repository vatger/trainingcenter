const { DataType } = require("sequelize-typescript");

const UserSolosModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        unique: true,
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    created_by: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
    },
    solo_used: {
        type: DataType.INTEGER,
        default: 0,
        allowNull: false,
    },
    extension_count: {
        type: DataType.INTEGER,
        default: 0,
        allowNull: false,
    },
    current_solo_start: {
        type: DataType.DATE,
        allowNull: true,
    },
    current_solo_end: {
        type: DataType.DATE,
        allowNull: true,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("user_solos", UserSolosModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("user_solos");
    },
};
