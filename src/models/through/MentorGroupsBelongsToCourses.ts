import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { MentorGroup } from "../MentorGroup";
import { Course } from "../Course";
import { sequelize } from "../../core/Sequelize";
import {
    MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_ATTRIBUTES,
    MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_NAME,
} from "../../../db/migrations/20221115171251-create-mentor-group-belongs-to-course-table";

export class MentorGroupsBelongsToCourses extends Model<InferAttributes<MentorGroupsBelongsToCourses>, InferCreationAttributes<MentorGroupsBelongsToCourses>> {
    //
    // Attributes
    //
    declare mentor_group_id: ForeignKey<MentorGroup["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare can_edit_course: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

MentorGroupsBelongsToCourses.init(MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_ATTRIBUTES, {
    tableName: MENTOR_GROUP_BELONGS_TO_COURSE_TABLE_NAME,
    sequelize: sequelize,
});
