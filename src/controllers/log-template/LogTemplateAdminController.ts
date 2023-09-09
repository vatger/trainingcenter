import { NextFunction, Request, Response } from "express";
import { TrainingLogTemplate } from "../../models/TrainingLogTemplate";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { HttpStatusCode } from "axios";
import _LogTemplateAdminValidator from "./_LogTemplateAdmin.validator";

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

        _LogTemplateAdminValidator.validateGetByID(params);

        const trainingLog = await TrainingLogTemplate.findOne({
            where: {
                id: params.id,
            },
        });

        if (trainingLog == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(trainingLog);
    } catch (e) {
        next(e);
    }
}

/**
 * Create a new Training Log Template
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const data = request.body as { name: string; content: object | object[] };

    const validation = ValidationHelper.validate([
        {
            name: "name",
            validationObject: data.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "content",
            validationObject: data.content,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.VALID_JSON }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const logTemplate = await TrainingLogTemplate.create({
        name: data.name,
        content: data.content,
    });

    response.sendStatus(HttpStatusCode.Created).send({ id: logTemplate.id });
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
        const body = request.body as { name: string; content: object | object[] };

        _LogTemplateAdminValidator.validateUpdate(body);

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
};
