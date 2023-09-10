import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { TrainingRequest } from "./TrainingRequest";

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
    declare deactivated: boolean;
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    declare updatedAt: CreationOptional<Date> | null;
    //
    declare training_requests?: NonAttribute<TrainingRequest[]>;
}

TrainingStation.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        callsign: {
            type: DataType.STRING(15),
            allowNull: false,
            unique: true,
        },
        frequency: {
            type: DataType.FLOAT(6, 3),
            allowNull: false,
        },
        deactivated: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_stations",
        sequelize: sequelize,
    }
);
