import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { TrainingType } from "./TrainingType";

export class ActionRequirement extends Model<InferAttributes<ActionRequirement>, InferCreationAttributes<ActionRequirement>> {
    //
    // Attributes
    //
    declare name: string;
    declare type: "action" | "requirement";
    declare action: string[];

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare courses?: NonAttribute<Course[]>;
    declare training_types?: NonAttribute<TrainingType[]>;

    declare static associations: {
        courses: Association<ActionRequirement, Course>;
        training_types: Association<ActionRequirement, TrainingType>;
    };
}

ActionRequirement.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING(70),
            comment: "Name of Action-/Requirements. Max length 70 chars",
            allowNull: false,
        },
        action: {
            type: DataType.JSON,
            comment: "Action-Array, including string array of automated actions",
            allowNull: false,
        },
        type: {
            type: DataType.ENUM("action", "requirement"),
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "actions_requirements",
        sequelize: sequelize,
    }
);
