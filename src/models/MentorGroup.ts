import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";

export class MentorGroup extends Model<InferAttributes<MentorGroup>, InferCreationAttributes<MentorGroup>> {
    //
    // Attributes
    //
    declare name: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare fir: CreationOptional<"edww" | "edgg" | "edmm">;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>;
    declare courses?: NonAttribute<Course[]>;

    declare static associations: {
        users: Association<MentorGroup, User>;
        courses: Association<MentorGroup, Course>;
    };
}

MentorGroup.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING(70),
            comment: "Name of mentor-group. Max length 70 chars",
            allowNull: false,
        },
        fir: {
            type: DataType.ENUM("edww", "edgg", "edmm"),
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "mentor_groups",
        sequelize: sequelize,
    }
);
