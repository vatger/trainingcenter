import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { ActionRequirement } from "../ActionRequirement";
import { Course } from "../Course";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

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
    declare execute_when: CreationOptional<"on_complete" | "on_enrolment"> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

ActionBelongsToCourses.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        action_id: {
            type: DataType.INTEGER,
            comment: "Action-/Requirement ID.",
            allowNull: false,
            references: {
                model: "actions_requirements",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        course_id: {
            type: DataType.INTEGER,
            comment: "Course ID.",
            allowNull: false,
            references: {
                model: "courses",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        execute_when: {
            type: DataType.ENUM("on_complete", "on_enrolment"),
            comment: "Defines when to execute the linked action.",
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "actions_belong_to_courses",
        sequelize: sequelize,
    }
);
