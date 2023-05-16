import { registerUserAssociations } from "./UserAssociations";
import { registerMentorGroupAssociations } from "./MentorGroupAssociations";
import { registerCourseAssociations } from "./CourseAssociations";
import { registerActionRequirementAssociations } from "./ActionRequirementAssociations";
import { registerTrainingTypeAssociations } from "./TrainingTypeAssociations";
import { registerTrainingSessionAssociations } from "./TrainingSessionAssociations";
import { registerEndorsementGroupAssociations } from "./EndorsementGroupAssociations";
import { registerTrainingLogAssociations } from "./TrainingLogAssociations";
import { registerTrainingRequestAssociations } from "./TrainingRequestAssociations";
import { registerFastTrackRequestAssociations } from "./FastTrackRequestAssociations";
import { registerRoleAssociations } from "./RoleAssociations";
import { registerTrainingStationAssociations } from "./TrainingStationAssociations";

export function registerAssociations() {
    registerUserAssociations();
    registerMentorGroupAssociations();
    registerCourseAssociations();
    registerActionRequirementAssociations();
    registerTrainingTypeAssociations();
    registerTrainingSessionAssociations();
    registerEndorsementGroupAssociations();
    registerTrainingLogAssociations();
    registerTrainingRequestAssociations();
    registerFastTrackRequestAssociations();
    registerRoleAssociations();
    registerTrainingStationAssociations();
}
