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
        PermissionHelper.checkUserHasPermission(user, "users.view");

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

/**
 * Returns basic user data by the id of the user (not entirely sure what the difference is to the above function)
 * @param request
 * @param response
 * @param next
 */
async function getBasicUserDataByID(request: Request, response: Response, next: NextFunction) {
    try {
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
    } catch (e) {
        next(e);
    }
}

export default {
    getUserDataByID,
    getBasicUserDataByID,
};
