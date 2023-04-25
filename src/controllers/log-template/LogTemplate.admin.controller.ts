import { Request, Response } from "express";
import { TrainingLogTemplate } from "../../models/TrainingLogTemplate";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

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

/**
 * Create a new Training Log Template
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const data = request.body.data;

    const validation = ValidationHelper.validate([
        {
            name: "name",
            validationObject: data.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "content",
            validationObject: data.content,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
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

    response.send(logTemplate);
}

export default {
    getAll,
    getAllMinimalData,
    create,
};
