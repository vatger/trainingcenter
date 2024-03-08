import { NextFunction, Request, Response } from "express";
import { MentorGroup } from "../../models/MentorGroup";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import _MentorGroupAdminValidator from "./_MentorGroupAdminValidator";
import { MentorGroupsBelongToEndorsementGroups } from "../../models/through/MentorGroupsBelongToEndorsementGroups";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

// Type used to create the mentor group. The request is of type Array<UserInMentorGroupT>
type UserInMentorGroupT = {
    user: User;
    admin: boolean;
    can_manage: boolean;
};

/**
 * Creates a mentor group and adds all users to this group
 * @param request - request.body.data
 * @param response
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { name: string; users: UserInMentorGroupT[] };

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            users: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.IS_ARRAY],
        });

        const mentorGroup = await MentorGroup.create({
            name: body.name,
            fir: request.body?.data?.fir == "" ? null : request.body.data.fir,
        });

        if (mentorGroup == null) {
            response.status(500).send({ message: "Failed to create Mentor Group!" });
            return;
        }

        for (const user of body.users) {
            await UserBelongToMentorGroups.create({
                user_id: user.user.id,
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

async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { mentor_group_id: number; name: string; fir: "none" | "edgg" | "edww" | "edmm" };

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
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const mentorGroups = await MentorGroup.findAll({
        include: {
            association: MentorGroup.associations.users,
            attributes: ["id", "first_name", "last_name"],
            through: {
                attributes: [],
            },
        },
    });
    response.send(mentorGroups);
}

/**
 *
 * @param request
 * @param response
 */
async function getByID(request: Request, response: Response) {
    const user: User = response.locals.user;
    const params = request.params;

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "id",
    //         validationObject: params.mentor_group_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);

    if (!(await user.isMentorGroupAdmin(Number(params.mentor_group_id)))) {
        response.sendStatus(HttpStatusCode.Forbidden);
        return;
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
}

/**
 * Gets all mentor groups in which the response.locals.user is an admin in
 * @param request
 * @param response
 */
async function getAllAdmin(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const userInMentorGroup: UserBelongToMentorGroups[] = await UserBelongToMentorGroups.findAll({
        where: {
            user_id: reqUser.id,
            group_admin: true,
        },
        include: {
            association: UserBelongToMentorGroups.associations.mentor_group,
        },
    });

    let mentorGroups: any[] = [];
    for (const u of userInMentorGroup) mentorGroups.push(u.mentor_group);

    response.send(mentorGroups);
}

async function getMembers(request: Request, response: Response) {
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
}

/**
 * Gets all mentor groups in which the response.locals.user is a course manager in
 * @param request
 * @param response
 */
async function getAllCourseManager(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const userInMentorGroup: UserBelongToMentorGroups[] = await UserBelongToMentorGroups.findAll({
        where: {
            user_id: reqUser.id,
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
}

async function addMember(request: Request, response: Response) {
    const user: User = response.locals.user;
    const body = request.body as { user_id: string; mentor_group_id: string; group_admin: boolean; can_manage_course: boolean };

    const validation = _MentorGroupAdminValidator.validateAddUser(body);

    if (!(await user.isMentorGroupAdmin(Number(body.mentor_group_id)))) {
        response.sendStatus(HttpStatusCode.Forbidden);
        return;
    }

    try {
        await UserBelongToMentorGroups.create({
            user_id: Number(body.user_id),
            group_id: Number(body.mentor_group_id),
            group_admin: body.group_admin,
            can_manage_course: body.can_manage_course,
        });
    } catch (e) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    const newMember = await User.findOne({
        where: {
            id: body.user_id,
        },
        attributes: ["id", "first_name", "last_name"],
    });

    response.send(newMember);
}

async function removeMember(request: Request, response: Response) {
    const user: User = response.locals.user;
    const body = request.body as { mentor_group_id: number; user_id: number };

    const validation = _MentorGroupAdminValidator.validateRemoveUser(body);

    try {
        await UserBelongToMentorGroups.destroy({
            where: {
                group_id: body.mentor_group_id,
                user_id: body.user_id,
            },
        });
    } catch (e) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    response.sendStatus(HttpStatusCode.NoContent);
}

async function getEndorsementGroupsByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { mentor_group_id: string };
        // TODO: Validate

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

async function addEndorsementGroupByID(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { mentor_group_id: string; endorsement_group_id: string };
        // TODO: Validate

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
