import { NextFunction, Request, Response } from "express";
import { TrainingType } from "../../models/TrainingType";
import { TrainingStation } from "../../models/TrainingStation";
import { TrainingStationBelongsToTrainingType } from "../../models/through/TrainingStationBelongsToTrainingType";
import { HttpStatusCode } from "axios";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

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
 * @param next
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        Validator.validate(params, {
            id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

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
    const body = request.body as { name: string; type: "online" | "sim" | "lesson" | "cpt"; log_template_id?: string; description?: string };
    Validator.validate(body, {
        name: [ValidationTypeEnum.NON_NULL],
        type: [ValidationTypeEnum.NON_NULL, { option: ValidationTypeEnum.IN_ARRAY, value: ["online", "sim", "lesson", "cpt"] }],
    });

    const log_template_id = Number(body.log_template_id);
    const trainingType = await TrainingType.create({
        name: body.name,
        type: body.type,
        description: !body.description || body.description == "" ? null : body.description,
        log_template_id: isNaN(log_template_id) || log_template_id == -1 ? null : log_template_id,
    });

    response.status(HttpStatusCode.Created).send(trainingType);
}

/**
 * Updates a training type specified by request.query.id
 * @param request
 * @param response
 */
async function update(request: Request, response: Response) {
    const training_type_id = request.params.id;
    const body = request.body as { name: string; type: "online" | "sim" | "cpt" | "lesson"; log_template_id?: string; description?: string };

    Validator.validate(body, {
        name: [ValidationTypeEnum.NON_NULL],
        type: [ValidationTypeEnum.NON_NULL],
    });

    let trainingType = await TrainingType.findOne({
        where: {
            id: training_type_id,
        },
    });

    if (trainingType == null) {
        response.status(500).send({ message: "Training type doesn't exist" });
        return;
    }

    let updatedTrainingType = await trainingType.update({
        name: body.name,
        type: body.type,
        description: !body.description || body.description == "" ? null : body.description,
        log_template_id: body.log_template_id == null || isNaN(Number(body.log_template_id)) ? null : Number(body.log_template_id),
    });

    response.send(updatedTrainingType);
}

async function addStation(request: Request, response: Response) {
    const body = request.body as { training_station_id: string; training_type_id: string };

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "training_type_id",
    //         validationObject: body.training_type_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    //     {
    //         name: "training_station_id",
    //         validationObject: body.training_station_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);

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
        response.status(HttpStatusCode.NotFound).send({ message: "Station and/or TrainingType with ID could not be found" });
        return;
    }

    await TrainingStationBelongsToTrainingType.create({
        training_station_id: Number(body.training_station_id),
        training_type_id: Number(body.training_type_id),
    });

    response.send(station);
}

async function removeStation(request: Request, response: Response) {
    const body = request.body as { training_station_id?: string; training_type_id?: string };
    Validator.validate(body, {
        training_station_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        training_type_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
    });

    await TrainingStationBelongsToTrainingType.destroy({
        where: {
            training_station_id: Number(body.training_station_id),
            training_type_id: Number(body.training_type_id),
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

export default {
    getAll,
    getByID,
    create,
    update,
    addStation,
    removeStation,
};
