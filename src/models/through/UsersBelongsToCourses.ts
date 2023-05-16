import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { User } from "../User";
import { Course } from "../Course";
import { TrainingType } from "../TrainingType";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

export class UsersBelongsToCourses extends Model<InferAttributes<UsersBelongsToCourses>, InferCreationAttributes<UsersBelongsToCourses>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare completed: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number> | null;
    declare next_training_type: CreationOptional<ForeignKey<TrainingType>> | number | null; // Required for type inference - don't know why
    declare skill_set: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_type_next?: NonAttribute<TrainingType>;
    declare course?: NonAttribute<Course>;

    declare static associations: {
        training_type_next: Association<UsersBelongsToCourses, TrainingType>;
        course: Association<UsersBelongsToCourses, Course>;
    };
}

UsersBelongsToCourses.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
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
        next_training_type: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_types",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        skill_set: {
            type: DataType.JSON,
            allowNull: true,
        },
        completed: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "users_belong_to_courses",
        sequelize: sequelize,
    }
);
