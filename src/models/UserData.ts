import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { User } from "./User";
import { sequelize } from "../core/Sequelize";
import {
    USER_DATA_TABLE_ATTRIBUTES,
    USER_DATA_TABLE_NAME
} from "../../db/migrations/20221115171243-create-user-data-table";

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
    declare country_code: CreationOptional<string> | null;
    declare country_name: CreationOptional<string> | null;
    declare region_code: CreationOptional<string> | null;
    declare region_name: CreationOptional<string> | null;
    declare division_code: CreationOptional<string> | null;
    declare division_name: CreationOptional<string> | null;
    declare subdivision_code: CreationOptional<string> | null;
    declare subdivision_name: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

UserData.init(USER_DATA_TABLE_ATTRIBUTES,
    {
        tableName: USER_DATA_TABLE_NAME,
        sequelize: sequelize,
    }
);
