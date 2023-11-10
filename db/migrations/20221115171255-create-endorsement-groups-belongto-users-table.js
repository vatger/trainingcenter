const { DataType } = require("sequelize-typescript");

const DataModelAttributes = {
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
    solo_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
            model: "user_solos",
            key: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
        // The solo is only ever deleted IFF a rating change has taken place.
        // Therefore, we can just set it null to indicate that the solo is over.
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable("endorsement_groups_belong_to_users", DataModelAttributes);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("endorsement_groups_belong_to_users");
    },

    DataModelAttributes,
};
