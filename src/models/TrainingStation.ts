import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { TrainingRequest } from "./TrainingRequest";
import { TRAINING_STATIONS_ATTRIBUTES, TRAINING_STATIONS_TABLE_NAME } from "../../db/migrations/20221115171252-create-training-stations-table";

export class TrainingStation extends Model<InferAttributes<TrainingStation>, InferCreationAttributes<TrainingStation>> {
    //
    // Attributes
    declare static associations: {
        training_requests: Association<TrainingStation, TrainingStation>;
    };
    //
    declare callsign: string;
    declare frequency: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare gcap_training_airport: CreationOptional<boolean>;
    declare gcap_class: CreationOptional<number>;
    declare gcap_class_group: CreationOptional<string> | null;
    declare s1_twr: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_requests?: NonAttribute<TrainingRequest[]>;
}

TrainingStation.init(TRAINING_STATIONS_ATTRIBUTES, {
    tableName: TRAINING_STATIONS_TABLE_NAME,
    sequelize: sequelize,
});
