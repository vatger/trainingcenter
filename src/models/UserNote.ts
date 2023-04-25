import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { Course } from "./Course";

export class UserNote extends Model<InferAttributes<UserNote>, InferCreationAttributes<UserNote>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare user_id: number;
    declare author_id: number;
    declare content: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare course_id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>;
    declare author?: NonAttribute<User>;
    declare course?: NonAttribute<Course>;

    declare static associations: {
        user: Association<UserNote, User>;
        author: Association<UserNote, User>;
        course: Association<UserNote, Course>;
    };
}

UserNote.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataType.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        author_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        course_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "courses",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        content: {
            type: DataType.TEXT,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "user_notes",
        sequelize: sequelize,
    }
);
