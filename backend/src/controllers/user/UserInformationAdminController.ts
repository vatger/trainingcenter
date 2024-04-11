import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { UserSolo } from "../../models/UserSolo";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

/**
 * Returns the user data for a user with id request.query.user_id
 * @param request
 * @param response
 * @param next
 */
async function getUserDataByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { user_id: string };

        Validator.validate(query, { user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER] });

        if (Number(query.user_id) == user.id) {
            PermissionHelper.checkUserHasPermission(user, "mentor.acc.manage.own");
        }

        const data = await User.findOne({
            where: {
                id: query.user_id,
            },
            include: [
                {
                    association: User.associations.user_solo,
                    include: [UserSolo.associations.solo_creator],
                },
                User.associations.user_data,
                User.associations.mentor_groups,
                User.associations.courses,
                User.associations.endorsement_groups,
            ],
        });

        response.send(data);
    } catch (e) {
        next(e);
    }
}

async function getBasicUserDataByID(request: Request, response: Response) {
    const query = request.query as { user_id: string };

    const user = await User.findOne({
        where: {
            id: query.user_id,
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
    });

    if (user == null) {
        response.status(404).send();
        return;
    }

    response.send(user);
}

/**
 * Returns the user data for a user with id request.query.user_id
 * @param request
 * @param response
 */
async function getSensitiveUserDataByID(request: Request, response: Response) {
    const user_id: string | undefined = request.query.user_id?.toString();
    const user: User = response.locals.user;

    if (user_id == null) {
        response.status(404).send({ error: 'Parameter "user_id" is required' });
        return;
    }
    //TODO: Change this to proper permission to access sensitive data
    //Potentially wrong, should user id be equal or not equal? (using logical or instead)
    PermissionHelper.checkUserHasPermission(user, "mentor.acc.manage.own");
    if (user_id == user.id.toString()) return;

    const data = await User.scope("sensitive").findOne({
        where: {
            id: user_id,
        },
        include: [
            {
                association: User.associations.user_data,
            },
            {
                association: User.associations.mentor_groups,
            },
            {
                association: User.associations.courses,
                through: {
                    as: "through",
                },
            },
        ],
    });

    response.send(data);
}

export default {
    getUserDataByID,
    getBasicUserDataByID,
    getSensitiveUserDataByID,
};
