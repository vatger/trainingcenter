import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { TRAINING_LOG_TEMPLATES_ATTRIBUTES, TRAINING_LOG_TEMPLATES_TABLE_NAME } from "../../db/migrations/20221115171245-create-training-log-templates-table";

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

TrainingLogTemplate.init(TRAINING_LOG_TEMPLATES_ATTRIBUTES, {
    tableName: TRAINING_LOG_TEMPLATES_TABLE_NAME,
    sequelize: sequelize,
});
