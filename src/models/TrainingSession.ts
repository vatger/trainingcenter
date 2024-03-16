import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { TrainingType } from "./TrainingType";
import { Course } from "./Course";
import { TrainingLog } from "./TrainingLog";
import { TrainingStation } from "./TrainingStation";
import { TrainingSessionBelongsToUsers } from "./through/TrainingSessionBelongsToUsers";
import { TRAINING_SESSION_TABLE_ATTRIBUTES, TRAINING_SESSION_TABLE_NAME } from "../../db/migrations/20221115171253-create-training-sessions-table";
import { CptSession } from "./CptSession";

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
    declare training_type_id: number | undefined | null;
    declare training_station_id: CreationOptional<ForeignKey<TrainingStation["id"]>> | undefined | null;
    declare cpt_session_id: CreationOptional<ForeignKey<CptSession["id"]>> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>; // Participants
    declare mentor?: NonAttribute<User>;
    declare training_type?: NonAttribute<TrainingType>;
    declare training_logs?: NonAttribute<TrainingLog[]>;
    declare training_station?: NonAttribute<TrainingStation>;
    declare course?: NonAttribute<Course>;
    declare training_session_belongs_to_users?: NonAttribute<TrainingSessionBelongsToUsers[]>;
    declare TrainingSessionBelongsToUsers?: NonAttribute<TrainingSessionBelongsToUsers>;
    declare cpt?: NonAttribute<CptSession>;

    declare static associations: {
        users: Association<TrainingSession, User>;
        mentor: Association<TrainingSession, User>;
        training_type: Association<TrainingSession, TrainingType>;
        training_logs: Association<TrainingSession, TrainingLog>;
        training_station: Association<TrainingSession, TrainingStation>;
        training_session_belongs_to_users: Association<TrainingSession, TrainingSessionBelongsToUsers>;
        course: Association<TrainingSession, Course>;
        cpt: Association<TrainingSession, CptSession>;
    };
}

TrainingSession.init(TRAINING_SESSION_TABLE_ATTRIBUTES, {
    tableName: TRAINING_SESSION_TABLE_NAME,
    sequelize: sequelize,
});
