const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
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
    rating_atc: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    rating_pilot: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    country_code: DataType.STRING(10),
    country_name: DataType.STRING,
    region_code: DataType.STRING(10),
    region_name: DataType.STRING,
    division_code: DataType.STRING(10),
    division_name: DataType.STRING,
    subdivision_code: DataType.STRING(10),
    subdivision_name: DataType.STRING,

    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("user_data", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("user_data");
    },

    DataModelAttributes,
};
