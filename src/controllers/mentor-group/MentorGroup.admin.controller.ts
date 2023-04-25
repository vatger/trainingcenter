import { Request, Response } from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { MentorGroup } from "../../models/MentorGroup";
import { UserBelongToMentorGroups } from "../../models/through/UserBelongToMentorGroups";
import { User } from "../../models/User";

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

/**
 *
 * @param request
 * @param response
 */
async function getByID(request: Request, response: Response) {
    const mentorGroupID = request.params.mentor_group_id;

    const validation = ValidationHelper.validate([
        {
            name: "id",
            validationObject: mentorGroupID,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const mentorGroup = await MentorGroup.findOne({
        where: {
            id: mentorGroupID,
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

export default {
    create,
    getByID,
    getAllAdmin,
    getAllCourseManager,
};
