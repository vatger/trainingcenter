import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { ActionRequirement } from "../ActionRequirement";
import { Course } from "../Course";
import { sequelize } from "../../core/Sequelize";
import {
    ACTION_BELONGS_TO_COURSE_TABLE_ATTRIBUTES,
    ACTION_BELONGS_TO_COURSE_TABLE_EXECUTE_WHEN_TYPES,
    ACTION_BELONGS_TO_COURSE_TABLE_NAME,
} from "../../../db/migrations/20221115171250-create-action-belongs-to-course-table";

// Note: This can also be a requirement!
export class ActionBelongsToCourses extends Model<InferAttributes<ActionBelongsToCourses>, InferCreationAttributes<ActionBelongsToCourses>> {
    //
    // Attributes
    //
    declare id: number;
    declare action_id: ForeignKey<ActionRequirement["id"]>;
    declare course_id: ForeignKey<Course["id"]>;

    //
    // Optional Attributes
    //
    declare execute_when: CreationOptional<(typeof ACTION_BELONGS_TO_COURSE_TABLE_EXECUTE_WHEN_TYPES)[number]> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

ActionBelongsToCourses.init(ACTION_BELONGS_TO_COURSE_TABLE_ATTRIBUTES, {
    tableName: ACTION_BELONGS_TO_COURSE_TABLE_NAME,
    sequelize: sequelize,
});
