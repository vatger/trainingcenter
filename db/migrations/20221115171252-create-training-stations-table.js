const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    callsign: {
        type: DataType.STRING(15),
        allowNull: false,
        unique: true,
    },
    frequency: {
        type: DataType.FLOAT(6, 3),
        allowNull: false,
        defaultValue: 199.998,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("training_stations", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_stations");
    },

    DataModelAttributes,
};
