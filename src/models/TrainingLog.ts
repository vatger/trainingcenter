import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { User } from "./User";
import { sequelize } from "../core/Sequelize";
import { TRAINING_LOG_TABLE_ATTRIBUTES, TRAINING_LOG_TABLE_NAME } from "../../db/migrations/20221115171257-create-training-log-table";

export class TrainingLog extends Model<InferAttributes<TrainingLog>, InferCreationAttributes<TrainingLog>> {
    //
    // Attributes
    //
    declare uuid: string;
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

TrainingLog.init(TRAINING_LOG_TABLE_ATTRIBUTES, {
    tableName: TRAINING_LOG_TABLE_NAME,
    sequelize: sequelize,
});
