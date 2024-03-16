import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { COURSE_INFORMATION_TABLE, COURSE_INFORMATION_TABLE_ATTRIBUTES } from "../../db/migrations/20221115171264-create-course-information-table";

export class CourseInformation extends Model<InferAttributes<CourseInformation>, InferCreationAttributes<CourseInformation>> {
    //
    // Attributes
    declare static associations: {
        course: Association<CourseInformation, Course>;
    };
    //
    declare data: object;

    //
    // Optional Attributes
    declare course_id: ForeignKey<Course["id"]>;
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    declare updatedAt: CreationOptional<Date> | null;
    //
    declare course?: NonAttribute<Course>; // Initial training type
}

CourseInformation.init(COURSE_INFORMATION_TABLE_ATTRIBUTES, {
    tableName: COURSE_INFORMATION_TABLE,
    sequelize: sequelize,
});
