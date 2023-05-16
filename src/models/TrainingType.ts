import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { TrainingStation } from "./TrainingStation";
import { Course } from "./Course";
import { TrainingLogTemplate } from "./TrainingLogTemplate";

export class TrainingType extends Model<InferAttributes<TrainingType>, InferCreationAttributes<TrainingType>> {
    //
    // Attributes
    //
    declare name: string;
    declare type: "online" | "sim" | "cpt" | "lesson";

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare log_template_id: CreationOptional<ForeignKey<TrainingLogTemplate["id"]>> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_stations?: NonAttribute<TrainingStation[]>;
    declare action_requirements?: NonAttribute<ActionRequirement[]>;
    declare log_template?: NonAttribute<TrainingLogTemplate>;
    declare courses?: NonAttribute<Course[]>;

    declare static associations: {
        training_stations: Association<TrainingType, TrainingStation>;
        action_requirements: Association<TrainingType, ActionRequirement>;
        log_template: Association<TrainingType, TrainingLogTemplate>;
        courses: Association<TrainingType, Course>;
    };
}

TrainingType.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING(70),
            comment: "Name of training type (eg. 'Frankfurt Tower Online'). Max length 70 chars",
            allowNull: false,
        },
        type: {
            type: DataType.ENUM("online", "sim", "cpt", "lesson"),
            comment: "Type of Training Type (ie. Sim Session - Sim)",
            allowNull: false,
        },
        log_template_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_log_templates",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_types",
        sequelize: sequelize,
    }
);
