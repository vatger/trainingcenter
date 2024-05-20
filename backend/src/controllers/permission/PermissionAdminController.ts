import { NextFunction, Request, Response } from "express";
import { Permission } from "../../models/Permission";
import { User } from "../../models/User";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { GenericException } from "../../exceptions/GenericException";
import { HttpStatusCode } from "axios";

/**
 * Gets all permissions
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.role_management.view");

        const permissions = await Permission.findAll();
        response.send(permissions);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates a new permission. If the name of this permission exists, returns a 400 error
 * @param request
 * @param response
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.role_management.edit");

        const body = request.body as { name: string };
        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL]
        });

        const [perm, created] = await Permission.findOrCreate({
            where: { name: body.name },
            defaults: {
                name: body.name,
            },
        });

        if (!created) {
            throw new GenericException("DUP_ENTRY", "Permission with this name already exists");
        }

        response.send(perm);
    } catch (e) {
        next(e);
    }
}

/**
 * Deletes a permission specified by request.body.perm_id
 * @param request
 * @param response
 * @param next
 */
async function destroy(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.role_management.edit");

        const body = request.body as {perm_id: string};
        Validator.validate(body, {
            perm_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER]
        });

        const res = await Permission.destroy({
            where: {
                id: body.perm_id,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    create,
    destroy,
};
