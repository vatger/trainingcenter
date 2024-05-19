import { NextFunction, Request, Response } from "express";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Job } from "../../models/Job";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { HttpStatusCode } from "axios";

/**
 * Returns all currently stored Job-Logs
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.joblog.view");

        const jobs = await Job.findAll();
        response.send(jobs);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets information on a single Job-Log
 * @param request
 * @param response
 * @param next
 */
async function getInformationByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.joblog.view");

        const params = request.params as { id: string };
        Validator.validate(params, { id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER] });

        const job = await Job.findOne({
            where: {
                id: params.id,
            },
        });

        if (job == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(job);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getInformationByID,
};
