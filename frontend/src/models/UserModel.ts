import { MentorGroupModel } from "./MentorGroupModel";
import { CourseModel } from "./CourseModel";
import { RoleModel } from "./PermissionModel";
import { EndorsementGroupModel, EndorsementGroupsBelongsToUsers } from "@/models/EndorsementGroupModel";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { TrainingLogModel } from "@/models/TrainingSessionBelongsToUser.model";

export type UserModel = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    user_data?: UserDataModel;
    user_settings?: UserSettingsModel;
    user_solo?: UserSoloModel;
    mentor_groups?: MentorGroupModel[];
    endorsement_groups?: EndorsementGroupModel[];
    courses?: CourseModel[];
    training_requests?: TrainingRequestModel[];
    training_sessions?: TrainingSessionModel[];
    training_logs?: TrainingLogModel[];
    roles?: RoleModel[];
    through?: any;
    createdAt: Date;
    updatedAt?: Date;

    UsersBelongsToCourses?: UserCourseThrough; // Append as required x | x
    UserBelongToMentorGroups?: UserMentorGroupThrough;
    EndorsementGroupsBelongsToUsers?: EndorsementGroupsBelongsToUsers;
};

export type UserSettingsModel = {
    user_id: number;
    language: "de" | "en";
    dark_mode: "auto" | "dark" | "light";
    email_notification_enabled: boolean;
    additional_emails?: string[];
    createdAt: Date;
    updatedAt?: Date;
};

export type UserDataModel = {
    rating_atc: number;
    rating_pilot: number;
    country_code: string;
    country_name: string;
    region_code: string;
    region_name: string;
    division_code: string;
    division_name: string;
    subdivision_code: string | undefined;
    subdivision_name: string | undefined;
    createdAt: Date;
    updatedAt?: Date;
};

export type UserSoloModel = {
    id: number;
    user_id: number;
    created_by: number;
    solo_rating: "s1" | "s2" | "s3" | "c1";
    solo_used: number;
    extension_count: number;
    current_solo_start?: Date;
    current_solo_end?: Date;

    createdAt: Date;
    updatedAt?: Date;

    solo_creator?: UserModel;
};

export type UserCourseThrough = {
    id: number;
    user_id: number;
    course_id: number;
    next_training_type?: number;
    skill_set?: JSON;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export type UserMentorGroupThrough = {
    group_admin: boolean;
    can_manage_course: boolean;
    createdAt: Date;
    updatedAt?: Date;
};
