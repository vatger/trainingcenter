import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";

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
