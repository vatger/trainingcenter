import { UserModel } from "./UserModel";

export type MentorGroupsBelongsToCourses = {
    id: number;
    mentor_group_id: number;
    course_id: number;
    can_edit_course: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

type UserBelongToMentorGroups = {
    id: number;
    user_id: number;
    group_id: number;
    group_admin: boolean;
    can_manage_course: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export type MentorGroupModel = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    fir?: "edww" | "edgg" | "edmm";
    through?: any;

    users?: UserModel[];

    MentorGroupsBelongsToCourses?: MentorGroupsBelongsToCourses;
    UserBelongToMentorGroups?: UserBelongToMentorGroups;
};
