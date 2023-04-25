const { DataType } = require("sequelize-typescript");

const RatingEnum = ["s1", "s2", "s3", "c1", "c3"];

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
    solo: {
        type: DataType.BOOLEAN,
        default: false,
        allowNull: false,
    },
    solo_rating: {
        type: DataType.ENUM(...RatingEnum),
        allowNull: false,
        default: "s1",
    },
    solo_expires: {
        type: DataType.DATE,
    },
    solo_extension_count: {
        type: DataType.INTEGER,
        default: 0,
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
