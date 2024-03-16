import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { TrainingType } from "../TrainingType";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../TrainingStation";
import {
    TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES,
    TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME,
} from "../../../db/migrations/20221115171256-create-training-station-belongs-to-training-type-table";

export class TrainingStationBelongsToTrainingType extends Model<
    InferAttributes<TrainingStationBelongsToTrainingType>,
    InferCreationAttributes<TrainingStationBelongsToTrainingType>
> {
    //
    // Attributes
    //
    declare static associations: {
        training_type: Association<TrainingStationBelongsToTrainingType, TrainingType>;
        training_station: Association<TrainingStationBelongsToTrainingType, TrainingStation>;
    };
    declare training_type_id: ForeignKey<TrainingType["id"]>;

    //
    // Optional Attributes
    //
    declare training_station_id: ForeignKey<TrainingStation["id"]>;
    declare id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare updatedAt: CreationOptional<Date> | null;
    declare training_type?: NonAttribute<TrainingType>;
    declare training_station?: NonAttribute<TrainingStation>;
}

TrainingStationBelongsToTrainingType.init(TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES, {
    tableName: TRAINING_STATION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME,
    sequelize: sequelize,
});
