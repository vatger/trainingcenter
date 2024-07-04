import { TrainingTypeModel } from "./TrainingTypeModel";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { ICourseEnrolRequirement } from "@common/Course.model";

export type CourseModel = {
    id: number;
    uuid: string;
    name: string;
    name_en: string;
    description: string;
    description_en: string;
    is_active: boolean;
    is_rating_course: boolean;
    self_enrollment_enabled: boolean;
    enrol_requirements?: ICourseEnrolRequirement[];
    initial_training_type?: number;
    skill_template_id?: number;
    createdAt?: Date;
    updatedAt?: Date;

    training_type?: TrainingTypeModel; // Initial Training Type
    training_types?: TrainingTypeModel[]; // All Training Types associated to this course
    action_requirements?: ActionRequirementModel;
    information?: CourseInformationModel;
    endorsement?: EndorsementGroupModel;

    UsersBelongsToCourses?: {
        id: number;
        user_id: number;
        course_id: number;
        next_training_type?: number;
        skill_set?: object;
        completed: boolean;
        createdAt?: Date;
        updatedAt?: Date;
    };
    through?: any;
};

export type ActionRequirementModel = {
    id: number;
    name: string;
    type: "action" | "requirement";
    action: string[];

    createdAt?: Date;
    updatedAt?: Date;

    courses?: CourseModel[];
    training_types?: TrainingTypeModel[];
};

export type CourseInformationModel = {
    id: number;
    course_id: number;
    data: any;
    createdAt?: Date;
    updatedAt?: Date;
};
