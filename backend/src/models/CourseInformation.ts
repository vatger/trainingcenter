import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { COURSE_INFORMATION_TABLE, COURSE_INFORMATION_TABLE_ATTRIBUTES } from "../../db/migrations/20221115171264-create-course-information-table";

export type ICourseInformationDurationUnits = "day" | "week" | "month" | "year";

export interface ICourseInformationData {
    duration?: number;
    duration_unit?: ICourseInformationDurationUnits;
    rating?: number;
    endorsement_id?: number;
}

export interface ICourseInformation {
    data: ICourseInformationData;
    course_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CourseInformation extends Model<InferAttributes<CourseInformation>, InferCreationAttributes<CourseInformation>> {
    declare data: object;
    declare course_id: ForeignKey<Course["id"]>;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare course?: NonAttribute<Course>; // Initial training type

    //
    // Attributes
    //
    declare static associations: {
        course: Association<CourseInformation, Course>;
    };
}

CourseInformation.init(COURSE_INFORMATION_TABLE_ATTRIBUTES, {
    tableName: COURSE_INFORMATION_TABLE,
    sequelize: sequelize,
});
