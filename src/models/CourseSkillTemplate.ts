import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class CourseSkillTemplate extends Model<InferAttributes<CourseSkillTemplate>, InferCreationAttributes<CourseSkillTemplate>> {
    //
    // Attributes
    //
    declare name: string;
    declare content: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

CourseSkillTemplate.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING,
            allowNull: false,
        },
        content: {
            type: DataType.JSON,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "course_skill_templates",
        sequelize: sequelize,
    }
);
