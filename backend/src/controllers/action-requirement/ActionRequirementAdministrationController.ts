import { NextFunction, Request, Response } from "express";
import { ActionRequirement } from "../../models/ActionRequirement";
import { User } from "../../models/User";
import PermissionHelper from "../../utility/helper/PermissionHelper";

/**
 * Get all action requirements stored in the database
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.action_requirements.view");

        const actionRequirements: ActionRequirement[] = await ActionRequirement.findAll();

        response.send(actionRequirements);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
};
