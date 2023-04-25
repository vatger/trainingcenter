const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    training_session_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_sessions",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
    log_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "training_logs",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    passed: {
        type: DataType.BOOLEAN,
        allowNull: true,
        default: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("training_session_belongs_to_users", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_session_belongs_to_users");
    },

    DataModelAttributes,
};
