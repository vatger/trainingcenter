import { NextFunction, Request, Response } from "express";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Job } from "../../models/Job";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { HttpStatusCode } from "axios";

async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const user = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "tech.joblog.view");

        const jobs = await Job.findAll();
        response.send(jobs);
    } catch (e) {
        next(e);
    }
}

async function getInformationByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user = response.locals.user;
        const params = request.params as { id: string };

        Validator.validate(params, { id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER] });
        PermissionHelper.checkUserHasPermission(user, "tech.joblog.view");

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
    } catch (e) {}
}

export default {
    getAll,
    getInformationByID,
};
