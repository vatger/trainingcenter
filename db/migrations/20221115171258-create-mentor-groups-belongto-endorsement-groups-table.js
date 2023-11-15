const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
    endorsement_group_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "endorsement_groups",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
    },
    mentor_group_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: "mentor_groups",
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
        await queryInterface.createTable("mentor_groups_belong_to_endorsement_groups", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("mentor_groups_belong_to_endorsement_groups");
    },

    DataModelAttributes,
};
