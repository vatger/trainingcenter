import { Request, Response } from "express";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { SysLog } from "../../models/SysLog";
import { User } from "../../models/User";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

/**
 * Gets all system log entries
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const user: User = request.body.user;

    if (!PermissionHelper.checkUserHasPermission(user, response, "tech.syslog.view")) return;

    const sysLogs = await SysLog.findAll({
        order: [["id", "desc"]],
        attributes: ["id", "method", "path", "createdAt"],
    });

    response.send(sysLogs);
}

async function getInformationByID(request: Request, response: Response) {
    const syslogID = request.params.id;

    const validation = ValidationHelper.validate([
        {
            name: "id",
            validationObject: syslogID,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const sysLog = await SysLog.findOne({
        where: {
            id: syslogID,
        },
    });

    response.send(sysLog);
}

export default {
    getAll,
    getInformationByID,
};
