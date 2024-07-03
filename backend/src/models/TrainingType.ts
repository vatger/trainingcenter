import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { TrainingStation } from "./TrainingStation";
import { Course } from "./Course";
import { TrainingLogTemplate } from "./TrainingLogTemplate";
import {
    TRAINING_TYPES_TABLE_ATTRIBUTES,
    TRAINING_TYPES_TABLE_NAME,
    TRAINING_TYPES_TABLE_TYPES,
} from "../../db/migrations/20221115171246-create-training-types-table";

export interface ITrainingType {
    id: number;
    name: string;
    type: (typeof TRAINING_TYPES_TABLE_TYPES)[number];
    course_id: number;
    is_initial_training: boolean;
    description?: string;
    log_template_id?: number;
    createdAt?: Date;
    updatedAt?: Date;

    training_stations?: any;
}

export class TrainingType extends Model<InferAttributes<TrainingType>, InferCreationAttributes<TrainingType>> {
    //
    // Attributes
    //
    declare name: string;
    declare type: (typeof TRAINING_TYPES_TABLE_TYPES)[number];
    declare course_id: ForeignKey<Course["id"]>;
    declare is_initial_training: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare description: CreationOptional<string> | null;
    declare log_template_id: CreationOptional<ForeignKey<TrainingLogTemplate["id"]>> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_stations?: NonAttribute<TrainingStation[]>;
    declare action_requirements?: NonAttribute<ActionRequirement[]>;
    declare log_template?: NonAttribute<TrainingLogTemplate>;
    declare course?: NonAttribute<Course>;

    declare static associations: {
        training_stations: Association<TrainingType, TrainingStation>;
        action_requirements: Association<TrainingType, ActionRequirement>;
        log_template: Association<TrainingType, TrainingLogTemplate>;
        course: Association<TrainingType, Course>;
    };
}

TrainingType.init(TRAINING_TYPES_TABLE_ATTRIBUTES, {
    tableName: TRAINING_TYPES_TABLE_NAME,
    sequelize: sequelize,
});
