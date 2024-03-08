import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class SysLog extends Model<InferAttributes<SysLog>, InferCreationAttributes<SysLog>> {
    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare user_id: CreationOptional<string> | null;
    declare path: CreationOptional<string> | null;
    declare method: CreationOptional<string> | null;
    declare remote_addr: CreationOptional<string> | null;
    declare message: CreationOptional<string> | null;

    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

SysLog.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataType.STRING,
            allowNull: true,
        },
        path: {
            type: DataType.STRING,
            allowNull: true,
        },
        method: {
            type: DataType.STRING(10),
            allowNull: true,
        },
        remote_addr: {
            type: DataType.STRING,
            allowNull: true,
        },
        message: {
            type: DataType.TEXT,
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "syslog",
        sequelize: sequelize,
    }
);
