import { TrainingStation } from "../TrainingStation";
import { TrainingType } from "../TrainingType";
import Logger, { LogLevels } from "../../utility/Logger";
import { ActionRequirement } from "../ActionRequirement";
import { ActionBelongsToTrainingTypes } from "../through/ActionBelongsToTrainingTypes";
import { Course } from "../Course";
import { TrainingLogTemplate } from "../TrainingLogTemplate";

export function registerTrainingTypeAssociations() {
    TrainingType.hasOne(Course, {
        as: "course",
        foreignKey: "id",
        sourceKey: "course_id",
    });

    Course.hasMany(TrainingType, {
        as: "training_types",
        foreignKey: "course_id",
        sourceKey: "id",
    });

    ActionRequirement.belongsToMany(TrainingType, {
        as: "training_types",
        through: ActionBelongsToTrainingTypes,
        foreignKey: "action_id",
        otherKey: "training_type_id",
    });

    TrainingType.belongsToMany(ActionRequirement, {
        as: "actions",
        through: ActionBelongsToTrainingTypes,
        foreignKey: "training_type_id",
        otherKey: "action_id",
    });

    TrainingType.hasOne(TrainingLogTemplate, {
        as: "log_template",
        foreignKey: "id",
        sourceKey: "log_template_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingTypeAssociations]");
}
