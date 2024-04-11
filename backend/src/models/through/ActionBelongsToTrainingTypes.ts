import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { ActionRequirement } from "../ActionRequirement";
import { TrainingType } from "../TrainingType";
import { sequelize } from "../../core/Sequelize";
import {
    ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES,
    ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_EXECUTE_WHEN_TYPES,
    ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME,
} from "../../../db/migrations/20221115171250-create-action-belongs-to-training-type-table";

// Note: This can also be a requirement!
export class ActionBelongsToTrainingTypes extends Model<InferAttributes<ActionBelongsToTrainingTypes>, InferCreationAttributes<ActionBelongsToTrainingTypes>> {
    //
    // Attributes
    //
    declare id: number;
    declare action_id: ForeignKey<ActionRequirement["id"]>;
    declare training_type_id: ForeignKey<TrainingType["id"]>;

    //
    // Optional Attributes
    //
    declare execute_when: CreationOptional<(typeof ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_EXECUTE_WHEN_TYPES)[number]> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

ActionBelongsToTrainingTypes.init(ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_ATTRIBUTES, {
    tableName: ACTION_BELONGS_TO_TRAINING_TYPE_TABLE_NAME,
    sequelize: sequelize,
});
