import { NextFunction, Request, Response } from "express";
import { MentorGroup } from "../../models/MentorGroup";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { MentorGroupsBelongToEndorsementGroups } from "../../models/through/MentorGroupsBelongToEndorsementGroups";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Creates a mentor group and adds all users to this group
 * @param request - request.body.data
 * @param response
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { name: string; users: any; fir: "edww" | "edgg" | "edmm" | "none" };

        PermissionHelper.checkUserHasPermission(user, "ln.mentor_group.create");

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            fir: [
                ValidationTypeEnum.NON_NULL,
                {
                    option: ValidationTypeEnum.IN_ARRAY,
                    value: ["none", "edgg", "edww", "edmm"],
                },
            ],
            users: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.VALID_JSON],
        });

        const mentorGroup = await MentorGroup.create({
            name: body.name,
            fir: body.fir == "none" ? null : body.fir,
        });

        if (mentorGroup == null) {
            response.status(500).send({ message: "Failed to create Mentor Group!" });
            return;
        }

        for (const user of body.users) {
            await UserBelongToMentorGroups.create({
                user_id: user.user_id,
                group_id: mentorGroup.id,
                group_admin: user.admin,
                can_manage_course: user.can_manage,
            });
        }

        response.send(mentorGroup);
    } catch (e) {
        next(e);
    }
}

/**
 * Updates a mentor group
 * @param request
 * @param response
 * @param next
 */
async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { mentor_group_id: number; name: string; fir: "none" | "edgg" | "edww" | "edmm" };

        if (!(await user.isMentorGroupAdmin(body.mentor_group_id))) {
            throw new ForbiddenException("You are not allowed to edit this mentor group");
        }

        Validator.validate(body, {
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            name: [ValidationTypeEnum.NON_NULL],
            fir: [
                ValidationTypeEnum.NON_NULL,
                {
                    option: ValidationTypeEnum.IN_ARRAY,
                    value: ["none", "edgg", "edww", "edmm"],
                },
            ],
        });

        await MentorGroup.update(
            {
                name: body.name,
                fir: body.fir == "none" ? null : body.fir ?? null,
            },
            {
                where: {
                    id: body.mentor_group_id,
                },
            }
        );

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a minimal list of all mentor-groups
 * Should be available to all (mentors), since this is used in the course mentor-group management too!
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const mentorGroups: MentorGroup[] = await MentorGroup.findAll({
            include: {
                association: MentorGroup.associations.users,
                attributes: ["id", "first_name", "last_name"],
                through: {
                    attributes: [],
                },
            },
        });
        response.send(mentorGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns information on a mentor group by ID
 * @param request
 * @param response
 * @param next
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params;

        Validator.validate(params, {
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        if (!(await user.isMentorGroupAdmin(params.mentor_group_id))) {
            throw new ForbiddenException("You are not allowed to edit this mentor group");
        }

        const mentorGroup = await MentorGroup.findOne({
            where: {
                id: params.mentor_group_id,
            },
            include: [
                {
                    association: MentorGroup.associations.users,
                    attributes: ["id", "first_name", "last_name"],
                    through: {
                        attributes: ["group_admin", "can_manage_course", "createdAt"],
                    },
                },
            ],
        });

        response.send(mentorGroup);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all mentor groups in which the response.locals.user is an admin in
 * This is only used to display the mentor group admin list, so we can use the respective permission, rather than generically checking
 * if the user is a mentor.
 * @param _request
 * @param response
 * @param next
 */
async function getAllAdmin(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.mentor_group.view");

        const userInMentorGroup: UserBelongToMentorGroups[] = await UserBelongToMentorGroups.findAll({
            where: {
                user_id: user.id,
                group_admin: true,
            },
            include: {
                association: UserBelongToMentorGroups.associations.mentor_group,
            },
        });

        let mentorGroups: any[] = [];
        for (const u of userInMentorGroup) mentorGroups.push(u.mentor_group);

        response.send(mentorGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns the members of a mentor group
 * Should be available to all mentors
 * @param request
 * @param response
 * @param next
 */
async function getMembers(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query;

        // Check if the mentor group is even a number
        const mentor_group_id = Number(query.mentor_group_id);
        if (isNaN(mentor_group_id)) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        const userInMentorGroup = await UserBelongToMentorGroups.findAll({
            where: {
                user_id: user.id,
                group_admin: true,
            },
        });

        if (!userInMentorGroup.find(uIMG => uIMG.group_id == Number(query.mentor_group_id))) {
            response.sendStatus(HttpStatusCode.Forbidden);
            return;
        }

        const mentorGroup = await MentorGroup.findOne({
            where: {
                id: Number(query.mentor_group_id),
            },
            include: [
                {
                    association: MentorGroup.associations.users,
                    attributes: ["id", "first_name", "last_name"],
                    through: {
                        attributes: ["group_admin", "can_manage_course", "createdAt"],
                    },
                },
            ],
        });

        if (mentorGroup == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        response.send(mentorGroup?.users);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all mentor groups in which the response.locals.user is a course manager in
 * @param _request
 * @param response
 * @param next
 */
async function getAllCourseManager(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInMentorGroup: UserBelongToMentorGroups[] = await UserBelongToMentorGroups.findAll({
            where: {
                user_id: user.id,
                can_manage_course: true,
            },
            include: {
                association: UserBelongToMentorGroups.associations.mentor_group,
            },
        });

        let mentorGroups = [];
        for (const u of userInMentorGroup) {
            if (u.mentor_group != null) mentorGroups.push(u.mentor_group);
        }

        response.send(mentorGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a mentor to a mentor group
 * Requires the mentor group administration privileges
 * @param request
 * @param response
 * @param next
 */
async function addMember(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as {
            user_id: string;
            mentor_group_id: string;
            group_admin: boolean;
            can_manage_course: boolean;
        };

        if (!(await user.isMentorGroupAdmin(body.mentor_group_id))) {
            throw new ForbiddenException("You are not allowed to edit this mentor group.");
        }

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL],
            mentor_group_id: [ValidationTypeEnum.NON_NULL],
            group_admin: [ValidationTypeEnum.NON_NULL],
            can_manage_course: [ValidationTypeEnum.NON_NULL],
        });

        await UserBelongToMentorGroups.create({
            user_id: Number(body.user_id),
            group_id: Number(body.mentor_group_id),
            group_admin: body.group_admin,
            can_manage_course: body.can_manage_course,
        });

        const newMember = await User.findOne({
            where: {
                id: body.user_id,
            },
            attributes: ["id", "first_name", "last_name"],
        });

        response.send(newMember);
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a mentor from the mentor group
 * Requires the mentor group administration privileges
 * @param request
 * @param response
 * @param next
 */
async function removeMember(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { mentor_group_id: number; user_id: number };

        if (!(await user.isMentorGroupAdmin(body.mentor_group_id))) {
            throw new ForbiddenException("You are not allowed to edit this mentor group.");
        }

        Validator.validate(body, {
            mentor_group_id: [ValidationTypeEnum.NON_NULL],
            user_id: [ValidationTypeEnum.NON_NULL],
        });

        await UserBelongToMentorGroups.destroy({
            where: {
                group_id: body.mentor_group_id,
                user_id: body.user_id,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of endorsement groups linked to a mentor group with the specified id.
 * @param request
 * @param response
 * @param next
 */
async function getEndorsementGroupsByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { mentor_group_id: string };

        Validator.validate(params, {
            mentor_group_id: [ValidationTypeEnum.NON_NULL],
        });

        const mentorGroup = await MentorGroup.findOne({
            where: {
                id: params.mentor_group_id,
            },
            include: [MentorGroup.associations.endorsement_groups],
        });

        if (mentorGroup == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(mentorGroup.endorsement_groups);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a new endorsement group to the specified mentor group
 * @param request
 * @param response
 * @param next
 */
async function addEndorsementGroupByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { mentor_group_id: string; endorsement_group_id: string };

        if (!(await user.isMentorGroupAdmin(body.mentor_group_id))) {
            throw new ForbiddenException("You are not allowed to edit this course");
        }

        Validator.validate(body, {
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            endorsement_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        await MentorGroupsBelongToEndorsementGroups.create({
            mentor_group_id: Number(body.mentor_group_id),
            endorsement_group_id: Number(body.endorsement_group_id),
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    update,
    addMember,
    removeMember,

    getAll,
    getByID,
    getAllAdmin,
    getMembers,
    getAllCourseManager,
    getEndorsementGroupsByID,
    addEndorsementGroupByID,
};
