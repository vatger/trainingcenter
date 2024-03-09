import { NextFunction, Request, Response } from "express";
import { TrainingLogTemplate } from "../../models/TrainingLogTemplate";
import { HttpStatusCode } from "axios";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

/**
 * Gets all training log templates
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const logTemplates = await TrainingLogTemplate.findAll();
    response.send(logTemplates);
}

/**
 * Gets all training log templates with minimal data (ID, Name)
 * @param request
 * @param response
 */
async function getAllMinimalData(request: Request, response: Response) {
    const logTemplates = await TrainingLogTemplate.findAll({
        attributes: ["id", "name"],
    });
    response.send(logTemplates);
}

async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        Validator.validate(params, { id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER] });

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
        const body = request.body as { name: string; content: any };

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            content: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.VALID_JSON],
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
        const params = request.params as { id: string };
        const body = request.body as { name: string; content: string };

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
        const params = request.params as { id: string };

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
