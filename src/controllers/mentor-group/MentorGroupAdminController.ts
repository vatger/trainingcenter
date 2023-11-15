import {NextFunction, Request, Response} from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { MentorGroup } from "../../models/MentorGroup";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import _MentorGroupAdminValidator from "./_MentorGroupAdminValidator";
import {MentorGroupsBelongToEndorsementGroups} from "../../models/through/MentorGroupsBelongToEndorsementGroups";

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
 */
async function create(request: Request, response: Response) {
    const mentorGroupName = request.body.data.name;
    const users = request.body.data.users as UserInMentorGroupT[];

    const validation = ValidationHelper.validate([
        {
            name: "name",
            validationObject: mentorGroupName,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "users",
            validationObject: users,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "fir",
            validationObject: request.body.data?.fir,
            toValidate: [{ val: ValidationOptions.IN_ARRAY, value: ["", "edgg", "edww", "edmm"] }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const mentorGroup = await MentorGroup.create({
        name: mentorGroupName,
        fir: request.body?.data?.fir == "" ? null : request.body.data.fir,
    });

    if (mentorGroup == null) {
        response.status(500).send({ message: "Failed to create Mentor Group!" });
        return;
    }

    for (const u of users) {
        await UserBelongToMentorGroups.create({
            user_id: u.user.id,
            group_id: mentorGroup.id,
            group_admin: u.admin,
            can_manage_course: u.can_manage,
        });
    }

    response.send(mentorGroup);
}

async function update(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { mentor_group_id: number; name: string; fir?: "-1" | "edgg" | "edww" | "edmm" };

    const validation = _MentorGroupAdminValidator.validateUpdate(body);
    if (validation.invalid) {
        response.status(HttpStatusCode.BadRequest).send({
            validation: validation.message,
            validation_failed: true,
        });
        return;
    }

    await MentorGroup.update(
        {
            name: body.name,
            fir: body.fir == "-1" ? null : body.fir ?? null,
        },
        {
            where: {
                id: body.mentor_group_id,
            },
        }
    );

    response.sendStatus(HttpStatusCode.NoContent);
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
    const user: User = request.body.user;
    const params = request.params;

    const validation = ValidationHelper.validate([
        {
            name: "id",
            validationObject: params.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

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
 * Gets all mentor groups in which the request.body.user is an admin in
 * @param request
 * @param response
 */
async function getAllAdmin(request: Request, response: Response) {
    const reqUser: User = request.body.user;

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
    const user: User = request.body.user;
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
 * Gets all mentor groups in which the request.body.user is a course manager in
 * @param request
 * @param response
 */
async function getAllCourseManager(request: Request, response: Response) {
    const reqUser: User = request.body.user;

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
    const user: User = request.body.user;
    const body = request.body as { user_id: string; mentor_group_id: string; group_admin: boolean; can_manage_course: boolean };

    const validation = _MentorGroupAdminValidator.validateAddUser(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

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
    const user: User = request.body.user;
    const body = request.body as { mentor_group_id: number; user_id: number };

    const validation = _MentorGroupAdminValidator.validateRemoveUser(body);
    if (validation.invalid) {
        response.status(HttpStatusCode.BadRequest).send({
            validation: validation.message,
            validation_failed: true,
        });
        return;
    }

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
        const params = request.params as {mentor_group_id: string};
        // TODO: Validate

        const mentorGroup = await MentorGroup.findOne({
            where: {
                id: params.mentor_group_id
            },
            include: [MentorGroup.associations.endorsement_groups]
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
        const body = request.body as {mentor_group_id: string; endorsement_group_id: string};
        // TODO: Validate

        await MentorGroupsBelongToEndorsementGroups.create({
            mentor_group_id: Number(body.mentor_group_id),
            endorsement_group_id: Number(body.endorsement_group_id)
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
    addEndorsementGroupByID
};
