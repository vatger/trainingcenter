import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { TrainingType } from "./TrainingType";
import { Course } from "./Course";
import { TrainingLog } from "./TrainingLog";
import { TrainingStation } from "./TrainingStation";
import { TrainingSessionBelongsToUsers } from "./through/TrainingSessionBelongsToUsers";

export class TrainingSession extends Model<InferAttributes<TrainingSession>, InferCreationAttributes<TrainingSession>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare course_id: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare mentor_id: CreationOptional<number> | null; // NULL for CPTs without Beisitzer ONLY!
    declare completed: CreationOptional<boolean>;
    declare date: CreationOptional<Date> | null;
    declare cpt_examiner_id: CreationOptional<number> | null;
    declare cpt_atsim_passed: CreationOptional<boolean> | null;
    declare training_type_id: number | undefined | null;
    declare training_station_id: CreationOptional<ForeignKey<TrainingStation["id"]>> | undefined | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>; // Participants
    declare mentor?: NonAttribute<User>;
    declare cpt_examiner?: NonAttribute<User>;
    declare training_type?: NonAttribute<TrainingType>;
    declare training_logs?: NonAttribute<TrainingLog[]>;
    declare training_station?: NonAttribute<TrainingStation>;
    declare course?: NonAttribute<Course>;
    declare training_session_belongs_to_users?: NonAttribute<TrainingSessionBelongsToUsers[]>;
    declare TrainingSessionBelongsToUsers?: NonAttribute<TrainingSessionBelongsToUsers>;

    declare static associations: {
        users: Association<TrainingSession, User>;
        mentor: Association<TrainingSession, User>;
        cpt_examiner: Association<TrainingSession, User>;
        training_type: Association<TrainingSession, TrainingType>;
        training_logs: Association<TrainingSession, TrainingLog>;
        training_station: Association<TrainingSession, TrainingStation>;
        training_session_belongs_to_users: Association<TrainingSession, TrainingSessionBelongsToUsers>;
        course: Association<TrainingSession, Course>;
    };
}

TrainingSession.init(
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
        completed: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        mentor_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        cpt_examiner_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
        },
        cpt_atsim_passed: {
            type: DataType.BOOLEAN,
            allowNull: true,
        },
        training_station_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_station",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
        },
        date: {
            type: DataType.DATE,
            allowNull: true,
        },
        training_type_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "training_types",
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
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_sessions",
        sequelize: sequelize,
    }
);
