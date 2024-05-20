import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { MentorGroup } from "../../models/MentorGroup";

/**
 * Gets all mentor groups that are associated with the current user
 * @param _request
 * @param response
 * @param next
 */
async function getMentorGroups(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInMentorGroups = await UserBelongToMentorGroups.findAll({
            where: {
                user_id: user.id,
            },
            include: [UserBelongToMentorGroups.associations.mentor_group],
        });

        let mentorGroups: MentorGroup[] = [];
        for (const u of userInMentorGroups) {
            if (u.mentor_group != null) mentorGroups.push(u.mentor_group);
        }

        response.send(mentorGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all mentor groups in which the current user can manage (i.e. can_manage_course flag set)
 * @param _request
 * @param response
 * @param next
 */
async function getCourseManagerMentorGroups(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInMentorGroups = await UserBelongToMentorGroups.findAll({
            where: {
                user_id: user.id,
                can_manage_course: true,
            },
            include: [UserBelongToMentorGroups.associations.mentor_group],
        });

        let mentorGroups: MentorGroup[] = [];
        for (const u of userInMentorGroups) {
            if (u.mentor_group != null) mentorGroups.push(u.mentor_group);
        }

        response.send(mentorGroups);
    } catch (e) {
        next(e);
    }
}

export default {
    getMentorGroups,
    getCourseManagerMentorGroups,
};
