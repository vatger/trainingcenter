import { DataType } from "sequelize-typescript";
import { QueryInterface } from "sequelize";

export const MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_NAME = "mentor_groups_belong_to_endorsement_groups";

export const MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_ATTRIBUTES = {
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

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable(MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_NAME, MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_ATTRIBUTES);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable(MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_NAME);
    },
};
