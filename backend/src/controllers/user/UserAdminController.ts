import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { ConversionUtils } from "turbocommons-ts";
import PermissionHelper from "../../utility/helper/PermissionHelper";

/**
 * Gets all users including their user data (VATSIM Data)
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const users = await User.findAll({
        include: [User.associations.user_data],
    });

    response.send(users);
}

/**
 * Gets all users including their sensitive data (email, etc.)
 * @param request
 * @param response
 */
async function getAllSensitive(request: Request, response: Response) {
    const users = await User.findAll({
        include: [User.associations.user_data],
    });

    response.send(users);
}

/**
 * Gets all users with minimal data only (CID, Name)
 * If the optional ?users=<base64> parameter is given, the users are filtered by this.
 * Note that the base64 string consists of JSON.stringify([..., cid, ...])
 * @param request
 * @param response
 * @param next
 */
async function getAllUsersMinimalData(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { users?: string };

        PermissionHelper.checkUserHasPermission(user, "mentor.view");

        let users: User[];

        if (query.users == null) {
            users = await User.findAll({
                attributes: ["id", "first_name", "last_name"],
            });
        } else {
            const userIds = JSON.parse(ConversionUtils.base64ToString(query.users)) as number[];
            users = await User.findAll({
                where: {
                    id: userIds,
                },
                attributes: ["id", "first_name", "last_name"],
            });
        }

        response.send(users);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getAllSensitive,
    getAllUsersMinimalData,
};
