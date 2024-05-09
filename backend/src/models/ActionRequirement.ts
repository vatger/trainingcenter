import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { ITrainingType, TrainingType } from "./TrainingType";
import {
    ACTION_REQUIREMENTS_TABLE_ATTRIBUTES,
    ACTION_REQUIREMENTS_TABLE_NAME,
    ACTION_REQUIREMENTS_TABLE_TYPES,
} from "../../db/migrations/20221115171249-create-actions-requirements-table";

/**
 * The first entry of each action is the corresponding enum value. For example, a requirement being the minimum rating will look as follows:
 * string value: "0:2"
 * This means that the requirement is requirement 0 of the ERequirements enum and contains the argument 2. This is entirely customizable, however in this case it means that
 * the minimum required rating id is 2 (S1 I think)
 */
export const enum ERequirements {
    REQUIREMENT_MIN_RATING_ATC,
    REQUIREMENT_MAX_RATING_ATC,
    REQUIREMENT_MOODLE_TEST_PASSED,
}

/**
 * Completely analogous to the ERequirements Enum. See {@link ERequirements} for more information.
 */
export const enum EActions {}

export interface IActionRequirement {
    id: number;
    name: string;
    type: (typeof ACTION_REQUIREMENTS_TABLE_TYPES)[number];
    action: string[];
    createdAt?: Date;
    updatedAt?: Date;

    training_types?: ITrainingType[];
}

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
