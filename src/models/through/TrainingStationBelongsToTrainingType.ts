import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { User } from "../User";
import { Course } from "../Course";
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
    //
    declare training_type_id: ForeignKey<TrainingType["id"]>;
    declare training_station_id: ForeignKey<TrainingStation["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare training_type?: NonAttribute<TrainingType>;
    declare training_station?: NonAttribute<TrainingStation>;

    declare static associations: {
        training_type: Association<TrainingStationBelongsToTrainingType, TrainingType>;
        training_station: Association<TrainingStationBelongsToTrainingType, TrainingStation>;
    };
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
