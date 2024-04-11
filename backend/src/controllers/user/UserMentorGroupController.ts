import { Request, Response } from "express";
import { User } from "../../models/User";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { MentorGroup } from "../../models/MentorGroup";

/**
 * Gets all mentor groups that are associated with the current user
 * @param request
 * @param response
 */
async function getMentorGroups(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const userInMentorGroups = await UserBelongToMentorGroups.findAll({
        where: {
            user_id: reqUser.id,
        },
        include: [UserBelongToMentorGroups.associations.mentor_group],
    });

    let mentorGroups: MentorGroup[] = [];
    for (const u of userInMentorGroups) {
        if (u.mentor_group != null) mentorGroups.push(u.mentor_group);
    }

    response.send(mentorGroups);
}

/**
 * Gets all mentor groups in which the current user can manage (i.e. can_manage_course flag set)
 * @param request
 * @param response
 */
async function getCourseManagerMentorGroups(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const userInMentorGroups = await UserBelongToMentorGroups.findAll({
        where: {
            user_id: reqUser.id,
            can_manage_course: true,
        },
        include: [UserBelongToMentorGroups.associations.mentor_group],
    });

    let mentorGroups: MentorGroup[] = [];
    for (const u of userInMentorGroups) {
        if (u.mentor_group != null) mentorGroups.push(u.mentor_group);
    }

    response.send(mentorGroups);
}

export default {
    getMentorGroups,
    getCourseManagerMentorGroups,
};
