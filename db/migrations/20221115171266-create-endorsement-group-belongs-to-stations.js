const { DataType } = require("sequelize-typescript");

const EndorsementGroupBelongsToStationsModelAttributes = {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    endorsement_group_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
            model: "endorsement_groups",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    station_id: {
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
        await queryInterface.createTable("endorsement_group_belongs_to_stations", EndorsementGroupBelongsToStationsModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("endorsement_group_belongs_to_stations");
    },
};
