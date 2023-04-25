import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class UserData extends Model<InferAttributes<UserData>, InferCreationAttributes<UserData>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare rating_atc: number;
    declare rating_pilot: number;

    //
    // Optional Attributes
    //
    declare country_code: CreationOptional<string>;
    declare country_name: CreationOptional<string>;
    declare region_code: CreationOptional<string>;
    declare region_name: CreationOptional<string>;
    declare division_code: CreationOptional<string>;
    declare division_name: CreationOptional<string>;
    declare subdivision_code: CreationOptional<string>;
    declare subdivision_name: CreationOptional<string>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

UserData.init(
    {
        user_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        rating_atc: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        rating_pilot: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        country_code: DataType.STRING(10),
        country_name: DataType.STRING,
        region_code: DataType.STRING(10),
        region_name: DataType.STRING,
        division_code: DataType.STRING(10),
        division_name: DataType.STRING,
        subdivision_code: DataType.STRING(10),
        subdivision_name: DataType.STRING,

        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "user_data",
        sequelize: sequelize,
    }
);
