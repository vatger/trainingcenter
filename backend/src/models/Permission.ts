import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { PERMISSION_TABLE_ATTRIBUTES, PERMISSION_TABLE_NAME } from "../../db/migrations/20221115171263-create-permission-tables";

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
    //
    // Attributes
    //
    declare name: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

Permission.init(PERMISSION_TABLE_ATTRIBUTES, {
    tableName: PERMISSION_TABLE_NAME,
    sequelize: sequelize,
});
