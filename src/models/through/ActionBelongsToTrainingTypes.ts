import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey } from "sequelize";
import { ActionRequirement } from "../ActionRequirement";
import { TrainingType } from "../TrainingType";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

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
    declare execute_when: CreationOptional<"on_complete" | "on_session_planned">;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

ActionBelongsToTrainingTypes.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        action_id: {
            type: DataType.INTEGER,
            comment: "Action-/Requirement ID.",
            allowNull: false,
            references: {
                model: "actions_requirements",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        training_type_id: {
            type: DataType.INTEGER,
            comment: "Training Type ID.",
            allowNull: false,
            references: {
                model: "training_types",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        execute_when: {
            type: DataType.ENUM("on_complete", "on_session_planned"),
            comment: "Defines when to execute the linked action. If this is a requirement, then execute_when is null!",
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "actions_belong_to_training_types",
        sequelize: sequelize,
    }
);
