import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { SYSLOG_TABLE_ATTRIBUTES, SYSLOG_TABLE_NAME } from "../../db/migrations/20221115171262-create-syslog-table";

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

SysLog.init(SYSLOG_TABLE_ATTRIBUTES, {
    tableName: SYSLOG_TABLE_NAME,
    sequelize: sequelize,
});
