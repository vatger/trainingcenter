const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    browser_uuid: {
        type: DataType.UUID,
        allowNull: false,
    },
    client: {
        type: DataType.STRING(100),
        allowNull: true,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    expires_at: {
        type: DataType.DATE,
        allowNull: false,
    },
    expires_latest: {
        type: DataType.DATE,
        allowNull: false,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("user_session", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("user_session");
    },

    DataModelAttributes,
};
