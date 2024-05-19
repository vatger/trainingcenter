import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export const ENDORSEMENT_GROUP_BELONGS_TO_USER_TABLE_NAME = "endorsement_groups_belong_to_users";

export const ENDORSEMENT_GROUP_BELONGS_TO_USER_TABLE_ATTRIBUTES = {
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
    vateud_id: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    createdAt: DataType.DATE,
    updatedAt: DataType.DATE,
};

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(ENDORSEMENT_GROUP_BELONGS_TO_USER_TABLE_NAME, ENDORSEMENT_GROUP_BELONGS_TO_USER_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(ENDORSEMENT_GROUP_BELONGS_TO_USER_TABLE_NAME);
    },
};
