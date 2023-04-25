const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    training_type_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_types",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    training_station_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "training_stations",
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
        await queryInterface.createTable("training_types_belong_to_training_stations", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("training_types_belong_to_training_stations");
    },

    DataModelAttributes,
};
