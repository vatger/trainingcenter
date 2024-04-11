import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { TrainingType } from "./TrainingType";
import {
    ACTION_REQUIREMENTS_TABLE_ATTRIBUTES,
    ACTION_REQUIREMENTS_TABLE_NAME,
    ACTION_REQUIREMENTS_TABLE_TYPES,
} from "../../db/migrations/20221115171249-create-actions-requirements-table";

export class ActionRequirement extends Model<InferAttributes<ActionRequirement>, InferCreationAttributes<ActionRequirement>> {
    //
    // Attributes
    //
    declare name: string;
    declare type: (typeof ACTION_REQUIREMENTS_TABLE_TYPES)[number];
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

ActionRequirement.init(ACTION_REQUIREMENTS_TABLE_ATTRIBUTES, {
    tableName: ACTION_REQUIREMENTS_TABLE_NAME,
    sequelize: sequelize,
});
