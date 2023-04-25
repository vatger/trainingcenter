import { TrainingRequest } from "../TrainingRequest";
import { User } from "../User";
import { TrainingType } from "../TrainingType";
import { TrainingSession } from "../TrainingSession";
import Logger, { LogLevels } from "../../utility/Logger";
import { Course } from "../Course";

export function registerTrainingRequestAssociations() {
    TrainingRequest.belongsTo(User, {
        as: "user",
        foreignKey: "user_id",
        targetKey: "id",
    });

    User.hasMany(TrainingRequest, {
        as: "training_requests",
        foreignKey: "user_id",
        sourceKey: "id",
    });

    TrainingRequest.hasOne(Course, {
        as: "course",
        foreignKey: "id",
        sourceKey: "course_id",
    });

    TrainingRequest.hasOne(TrainingType, {
        as: "training_type",
        foreignKey: "id",
        sourceKey: "training_type_id",
    });

    TrainingType.hasMany(TrainingRequest, {
        as: "training_requests",
        foreignKey: "training_type_id",
        sourceKey: "id",
    });

    TrainingRequest.hasOne(TrainingSession, {
        as: "training_session",
        foreignKey: "id",
        sourceKey: "training_session_id",
    });

    TrainingSession.hasMany(TrainingRequest, {
        as: "training_requests",
        foreignKey: "training_session_id",
        sourceKey: "id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingRequestAssociations]");
}
