import { NextFunction, Request, Response } from "express";
import { TrainingLogTemplate } from "../../models/TrainingLogTemplate";
import { HttpStatusCode } from "axios";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { User } from "../../models/User";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import PermissionHelper from "../../utility/helper/PermissionHelper";

/**
 * Gets all training log templates
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "atd.log_template.view");

        const logTemplates = await TrainingLogTemplate.findAll();
        response.send(logTemplates);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all training log templates with minimal data (ID, Name)
 * @param _request
 * @param response
 * @param next
 */
async function getAllMinimalData(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        if (!(await user.isMentor())) {
            throw new ForbiddenException("You are not a mentor");
        }

        const logTemplates = await TrainingLogTemplate.findAll({
            attributes: ["id", "name"],
        });
        response.send(logTemplates);
    } catch (e) {
        next(e);
    }
}

async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };

        PermissionHelper.checkUserHasPermission(user, "atd.log_template.view");

        const trainingLogTemplate = await TrainingLogTemplate.findOne({
            where: {
                id: params.id,
            },
        });

        if (trainingLogTemplate == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(trainingLogTemplate);
    } catch (e) {
        next(e);
    }
}

/**
 * Create a new Training Log Template
 * @param request
 * @param response
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { name: string; content: any };

        PermissionHelper.checkUserHasPermission(user, "atd.log_template.create");

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            content: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.VALID_JSON, ValidationTypeEnum.IS_ARRAY],
        });

        const logTemplate = await TrainingLogTemplate.create({
            name: body.name,
            content: body.content,
        });

        response.status(HttpStatusCode.Created).send(logTemplate);
    } catch (e) {
        next(e);
    }
}

/**
 * Update a training log template
 * @param request
 * @param response
 * @param next
 */
async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const body = request.body as { name: string; content: string };

        PermissionHelper.checkUserHasPermission(user, "atd.log_template.edit");

        Validator.validate(params, { id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER] });
        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            content: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.VALID_JSON],
        });

        await TrainingLogTemplate.update(
            {
                name: body.name,
                content: body.content,
            },
            {
                where: {
                    id: params.id,
                },
            }
        );

        const trainingLogTemplate = await TrainingLogTemplate.findOne({
            where: {
                id: params.id,
            },
        });

        response.send(trainingLogTemplate);
    } catch (e) {
        next(e);
    }
}

/**
 * Delete a training log template
 * @param request
 * @param response
 * @param next
 */
async function destroy(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };

        PermissionHelper.checkUserHasPermission(user, "atd.log_template.edit");

        Validator.validate(params, {
            id: [ValidationTypeEnum.NON_NULL],
        });

        await TrainingLogTemplate.destroy({
            where: {
                id: params.id,
            },
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getAllMinimalData,
    getByID,
    create,
    update,
    destroy,
};
