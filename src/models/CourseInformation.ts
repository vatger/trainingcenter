import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingType } from "./TrainingType";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { MentorGroup } from "./MentorGroup";
import { CourseSkillTemplate } from "./CourseSkillTemplate";
import { User } from "./User";
import { Course } from "./Course";

export class CourseInformation extends Model<InferAttributes<CourseInformation>, InferCreationAttributes<CourseInformation>> {
    //
    // Attributes
    //
    declare data: object;
    declare course_id: ForeignKey<Course["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare course?: NonAttribute<Course>; // Initial training type

    declare static associations: {
        course: Association<CourseInformation, Course>;
    };
}

CourseInformation.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        course_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "courses",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        data: {
            type: DataType.JSON,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "course_information",
        sequelize: sequelize,
    }
);
