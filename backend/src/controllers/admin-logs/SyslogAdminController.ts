import { NextFunction, Request, Response } from "express";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { SysLog } from "../../models/SysLog";
import { User } from "../../models/User";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

/**
 * Gets all system log entries
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.syslog.view");

        const sysLogs: SysLog[] = await SysLog.findAll({
            order: [["id", "desc"]],
            attributes: ["id", "method", "path", "createdAt"],
        });

        response.send(sysLogs);
    } catch (e) {
        next(e);
    }
}

async function getInformationByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.syslog.view");

        const params = request.params;
        Validator.validate(params, {
            id: [ValidationTypeEnum.NON_NULL],
        });

        const sysLog: SysLog | null = await SysLog.findOne({
            where: {
                id: params.id,
            },
        });

        response.send(sysLog);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getInformationByID,
};
