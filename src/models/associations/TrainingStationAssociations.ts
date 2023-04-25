import Logger, { LogLevels } from "../../utility/Logger";
import { TrainingStation } from "../TrainingStation";
import { TrainingRequest } from "../TrainingRequest";
import { TrainingStationBelongsToTrainingType } from "../through/TrainingStationBelongsToTrainingType";
import { TrainingType } from "../TrainingType";

export function registerTrainingStationAssociations() {
    //
    // TrainingStation -> TrainingType
    // n : m
    //
    TrainingStation.belongsToMany(TrainingType, {
        as: "training_requests",
        through: TrainingStationBelongsToTrainingType,
        foreignKey: "training_station_id",
        otherKey: "training_type_id",
        targetKey: "id",
    });

    //
    // TrainingType -> TrainingStation
    // n : m
    //
    TrainingType.belongsToMany(TrainingStation, {
        as: "training_stations",
        through: TrainingStationBelongsToTrainingType,
        foreignKey: "training_type_id",
        otherKey: "training_station_id",
        targetKey: "id",
    });

    //
    // TrainingStationBelongsToTrainingType -> TrainingType
    // 1 : 1
    //
    TrainingStationBelongsToTrainingType.hasOne(TrainingType, {
        foreignKey: "id",
        sourceKey: "training_type_id",
    });

    //
    // TrainingStationBelongsToTrainingType -> TrainingStation
    // 1 : 1
    //
    TrainingStationBelongsToTrainingType.hasOne(TrainingStation, {
        foreignKey: "id",
        sourceKey: "training_station_id",
    });

    TrainingRequest.hasOne(TrainingStation, {
        as: "training_station",
        foreignKey: "id",
        sourceKey: "training_station_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingStationAssociations]");
}
