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
    content: {
        type: DataType.JSON,
        allowNull: false,
        default: [],
    },
    log_public: {
        type: DataType.BOOLEAN,
        allowNull: false,
        default: true,
    },
    author_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
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
        await queryInterface.createTable("training_logs", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_logs");
    },

    DataModelAttributes,
};
