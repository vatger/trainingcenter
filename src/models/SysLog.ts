import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class SysLog extends Model<InferAttributes<SysLog>, InferCreationAttributes<SysLog>> {
    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare user_id: CreationOptional<string>;
    declare path: CreationOptional<string>;
    declare method: CreationOptional<string>;
    declare remote_addr: CreationOptional<string>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
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
        },
        path: {
            type: DataType.STRING,
        },
        method: {
            type: DataType.STRING(10),
        },
        remote_addr: {
            type: DataType.STRING,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "syslog",
        sequelize: sequelize,
    }
);
