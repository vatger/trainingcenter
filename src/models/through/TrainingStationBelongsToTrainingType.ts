import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { TrainingType } from "../TrainingType";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../TrainingStation";

export class TrainingStationBelongsToTrainingType extends Model<
    InferAttributes<TrainingStationBelongsToTrainingType>,
    InferCreationAttributes<TrainingStationBelongsToTrainingType>
> {
    //
    // Attributes
    declare static associations: {
        training_type: Association<TrainingStationBelongsToTrainingType, TrainingType>;
        training_station: Association<TrainingStationBelongsToTrainingType, TrainingStation>;
    };
    //
    declare training_type_id: ForeignKey<TrainingType["id"]>;

    //
    // Optional Attributes
    declare training_station_id: ForeignKey<TrainingStation["id"]>;
    //
    declare id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    declare updatedAt: CreationOptional<Date> | null;
    //
    declare training_type?: NonAttribute<TrainingType>;
    declare training_station?: NonAttribute<TrainingStation>;
}

TrainingStationBelongsToTrainingType.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        training_station_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "training_stations",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_types_belong_to_training_stations",
        sequelize: sequelize,
    }
);
