import { ActionRequirement } from "../ActionRequirement";
import { Course } from "../Course";
import { ActionBelongsToCourses } from "../through/ActionBelongsToCourses";
import Logger, { LogLevels } from "../../utility/Logger";

export function registerActionRequirementAssociations() {
    ActionRequirement.belongsToMany(Course, {
        as: "courses",
        through: ActionBelongsToCourses,
        foreignKey: "action_id",
        otherKey: "id",
    });

    Course.belongsToMany(ActionRequirement, {
        as: "action_requirements",
        through: ActionBelongsToCourses,
        foreignKey: "course_id",
        otherKey: "id",
    });

    Logger.log(LogLevels.LOG_INFO, "[ActionRequirementAssociations]");
}
