import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class TrainingLog extends Model<InferAttributes<TrainingLog>, InferCreationAttributes<TrainingLog>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare log_public: boolean;
    declare content: any;
    declare author_id: ForeignKey<User["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare author?: NonAttribute<User>;

    declare static associations: {
        author: Association<TrainingLog, User>;
    };
}

TrainingLog.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataType.UUID,
            allowNull: false,
        },
        content: {
            type: DataType.JSON,
            allowNull: false,
        },
        log_public: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        author_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_logs",
        sequelize: sequelize,
    }
);
