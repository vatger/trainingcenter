const { DataType } = require("sequelize-typescript");

const ActionTypeEnum = ["action", "requirement"];

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataType.STRING(70),
        comment: "Name of Action-/Requirements. Max length 70 chars",
        allowNull: false,
    },
    action: {
        type: DataType.JSON,
        comment: "Action-Array, including string array of automated actions",
        default: [],
        allowNull: false,
    },
    type: {
        type: DataType.ENUM(...ActionTypeEnum),
        allowNull: false,
        default: "action",
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("actions_requirements", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("actions_requirements");
    },

    DataModelAttributes,
};
