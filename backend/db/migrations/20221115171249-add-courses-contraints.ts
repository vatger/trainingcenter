import { QueryInterface } from "sequelize";
import { COURSE_TABLE_NAME } from "./20221115171247-create-courses-table";
import { TRAINING_TYPES_TABLE_NAME } from "./20221115171248-create-training-types-table";



export default {
    async up(queryInterface: QueryInterface) {
        await         queryInterface.addConstraint(COURSE_TABLE_NAME, {
            type: "foreign key",
            fields: ['initial_training_type'],
            references: {
                table: TRAINING_TYPES_TABLE_NAME,
                field: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
        })
    },

    async down(queryInterface: QueryInterface) {

    },
};
