import { TrainingSession } from "../TrainingSession";
import { User } from "../User";
import { TrainingType } from "../TrainingType";
import { Course } from "../Course";
import Logger, { LogLevels } from "../../utility/Logger";
import { TrainingSessionBelongsToUsers } from "../through/TrainingSessionBelongsToUsers";
import { TrainingLog } from "../TrainingLog";
import { TrainingStation } from "../TrainingStation";

export function registerTrainingSessionAssociations() {
    TrainingSession.hasOne(TrainingStation, {
        as: "training_station",
        sourceKey: "training_station_id",
        foreignKey: "id",
    });

    TrainingStation.hasMany(TrainingSession, {
        as: "training_sessions",
        sourceKey: "id",
        foreignKey: "training_station_id",
    });

    TrainingSessionBelongsToUsers.hasOne(User, {
        as: "user",
        sourceKey: "user_id",
        foreignKey: "id",
    });

    TrainingSessionBelongsToUsers.hasOne(TrainingSession, {
        as: "training_session",
        sourceKey: "training_session_id",
        foreignKey: "id",
    });

    TrainingSessionBelongsToUsers.hasOne(TrainingLog, {
        as: "training_log",
        sourceKey: "log_id",
        foreignKey: "id",
    });

    TrainingSession.hasMany(TrainingSessionBelongsToUsers, {
        as: "training_session_belongs_to_users",
        sourceKey: "id",
        foreignKey: "training_session_id",
    });

    TrainingSession.hasOne(User, {
        as: "mentor",
        sourceKey: "mentor_id",
        foreignKey: "id",
    });

    TrainingSession.hasOne(User, {
        as: "cpt_examiner",
        sourceKey: "cpt_examiner_id",
        foreignKey: "id",
    });

    User.hasMany(TrainingSession, {
        as: "mentor_sessions",
        foreignKey: "mentor_id",
        sourceKey: "id",
    });

    User.hasMany(TrainingSession, {
        as: "cpt_examiner_sessions",
        foreignKey: "cpt_examiner_id",
        sourceKey: "id",
    });

    TrainingSession.hasOne(TrainingType, {
        as: "training_type",
        sourceKey: "training_type_id",
        foreignKey: "id",
    });

    TrainingType.hasMany(TrainingSession, {
        as: "training_session",
        foreignKey: "training_type_id",
        sourceKey: "id",
    });

    TrainingSession.hasOne(Course, {
        as: "course",
        sourceKey: "course_id",
        foreignKey: "id",
    });

    Course.hasMany(TrainingSession, {
        as: "training_session",
        foreignKey: "course_id",
        sourceKey: "id",
    });

    User.belongsToMany(TrainingSession, {
        as: "training_sessions",
        through: TrainingSessionBelongsToUsers,
        foreignKey: "user_id",
        otherKey: "training_session_id",
    });

    TrainingSession.belongsToMany(User, {
        as: "users",
        through: TrainingSessionBelongsToUsers,
        foreignKey: "training_session_id",
        otherKey: "user_id",
    });

    TrainingSession.belongsToMany(TrainingLog, {
        as: "training_logs",
        through: TrainingSessionBelongsToUsers,
        foreignKey: "training_session_id",
        otherKey: "log_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingSessionAssociations]");
}
