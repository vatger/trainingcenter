import { TrainingStation } from "../TrainingStation";
import { TrainingType } from "../TrainingType";
import Logger, { LogLevels } from "../../utility/Logger";
import { ActionRequirement } from "../ActionRequirement";
import { ActionBelongsToTrainingTypes } from "../through/ActionBelongsToTrainingTypes";
import { Course } from "../Course";
import { TrainingTypesBelongsToCourses } from "../through/TrainingTypesBelongsToCourses";
import { TrainingLogTemplate } from "../TrainingLogTemplate";

export function registerTrainingTypeAssociations() {
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

    Course.belongsToMany(TrainingType, {
        as: "training_types",
        through: TrainingTypesBelongsToCourses,
        foreignKey: "course_id",
        otherKey: "training_type_id",
    });

    TrainingType.belongsToMany(Course, {
        as: "courses",
        through: TrainingTypesBelongsToCourses,
        foreignKey: "training_type_id",
        otherKey: "course_id",
    });

    TrainingType.hasOne(TrainingLogTemplate, {
        as: "log_template",
        foreignKey: "id",
        sourceKey: "log_template_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingTypeAssociations]");
}
