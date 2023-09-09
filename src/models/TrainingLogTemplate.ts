import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class TrainingLogTemplate extends Model<InferAttributes<TrainingLogTemplate>, InferCreationAttributes<TrainingLogTemplate>> {
    //
    // Attributes
    //
    declare name: string;
    declare content: string | object | object[];

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

TrainingLogTemplate.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING,
            allowNull: false,
        },
        content: {
            type: DataType.JSON,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_log_templates",
        sequelize: sequelize,
    }
);
