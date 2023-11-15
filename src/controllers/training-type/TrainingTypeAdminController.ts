import { NextFunction, Request, Response } from "express";
import { TrainingType } from "../../models/TrainingType";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { TrainingStation } from "../../models/TrainingStation";
import { TrainingStationBelongsToTrainingType } from "../../models/through/TrainingStationBelongsToTrainingType";
import { HttpStatusCode } from "axios";

/**
 * Gets all training types
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const trainingTypes = await TrainingType.findAll();

    response.send(trainingTypes);
}

/**
 * Gets a training type by its ID
 * @param request
 * @param response
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        const validation = ValidationHelper.validate([
            {
                name: "id",
                validationObject: params.id,
                toValidate: [{ val: ValidationOptions.NON_NULL }],
            },
        ]);

        if (validation.invalid) {
            response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
            return;
        }

        const trainingType = await TrainingType.findOne({
            where: {
                id: params.id,
            },
            include: [
                {
                    association: TrainingType.associations.log_template,
                    attributes: {
                        exclude: ["content"],
                    },
                },
                {
                    association: TrainingType.associations.training_stations,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        response.send(trainingType);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates a new TrainingType
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const body = request.body as { name: string; type: "online" | "sim" | "lesson" | "cpt"; log_template_id?: string };

    const validation = ValidationHelper.validate([
        {
            name: "name",
            validationObject: body.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "type",
            validationObject: body.type,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const log_template_id = Number(body.log_template_id);
    const trainingType = await TrainingType.create({
        name: body.name,
        type: body.type,
        log_template_id: isNaN(log_template_id) || log_template_id == -1 ? null : log_template_id,
    });

    response.status(HttpStatusCode.Created).send({ id: trainingType.id });
}

/**
 * Updates a training type specified by request.query.id
 * @param request
 * @param response
 */
async function update(request: Request, response: Response) {
    const training_type_id = request.params.id;
    const requestData = request.body.data;

    const validation = ValidationHelper.validate([
        {
            name: "id",
            validationObject: training_type_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "name",
            validationObject: requestData.name,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "type",
            validationObject: requestData.type,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    let trainingType = await TrainingType.findOne({
        where: {
            id: training_type_id,
        },
    });

    if (trainingType == null) {
        response.status(500).send({ message: "Training type doesn't exist" });
        return;
    }

    await trainingType.update({
        name: requestData.name,
        type: requestData.type,
        log_template_id: isNaN(requestData.log_template_id) || Number(requestData.log_template_id) == -1 ? null : Number(requestData.log_template_id),
    });

    response.sendStatus(HttpStatusCode.Ok);
}

async function addStation(request: Request, response: Response) {
    const body = request.body as { training_station_id: string; training_type_id: string };

    const validation = ValidationHelper.validate([
        {
            name: "training_type_id",
            validationObject: body.training_type_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
        {
            name: "training_station_id",
            validationObject: body.training_station_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const station = await TrainingStation.findOne({
        where: {
            id: body.training_station_id,
        },
    });

    const trainingType = await TrainingType.findOne({
        where: {
            id: body.training_type_id,
        },
    });

    if (station == null || trainingType == null) {
        response.status(404).send({ message: "Station and/or TrainingType with ID could not be found" });
        return;
    }

    await TrainingStationBelongsToTrainingType.create({
        training_station_id: Number(body.training_station_id),
        training_type_id: Number(body.training_type_id),
    });

    response.send(station);
}

async function removeStation(request: Request, response: Response) {
    const requestData = request.body.data;
    //TODO
    response.send("OK");
}

export default {
    getAll,
    getByID,
    create,
    update,
    addStation,
    removeStation,
};
