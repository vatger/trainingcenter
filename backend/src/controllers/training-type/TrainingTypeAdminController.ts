import { NextFunction, Request, Response } from "express";
import { TrainingType } from "../../models/TrainingType";
import { TrainingStation } from "../../models/TrainingStation";
import { TrainingStationBelongsToTrainingType } from "../../models/through/TrainingStationBelongsToTrainingType";
import { HttpStatusCode } from "axios";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { TRAINING_TYPES_TABLE_TYPES } from "../../../db/migrations/20221115171246-create-training-types-table";
import { User } from "../../models/User";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Course } from "../../models/Course";

/**
 * Gets all training types
 * Useful for all mentors when creating courses, etc.
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const trainingTypes = await TrainingType.findAll();

        response.send(trainingTypes);
    } catch (e) {
        next(e);
    }
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
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.training_types.create");

        const body = request.body as {
            name: string;
            course_uuid: string;
            type: (typeof TRAINING_TYPES_TABLE_TYPES)[number];
            log_template_id?: string;
            description?: string;
        };
        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            course_uuid: [ValidationTypeEnum.NON_NULL],
            type: [
                ValidationTypeEnum.NON_NULL,
                {
                    option: ValidationTypeEnum.IN_ARRAY,
                    value: TRAINING_TYPES_TABLE_TYPES,
                },
            ],
        });

        const courseID = await Course.getIDFromUUID(body.course_uuid);

        const log_template_id = Number(body.log_template_id);
        const trainingType = await TrainingType.create({
            name: body.name,
            type: body.type,
            course_id: courseID,
            is_initial_training: false,
            description: !body.description || body.description == "" ? null : body.description,
            log_template_id: isNaN(log_template_id) || log_template_id == -1 ? null : log_template_id,
        });

        response.status(HttpStatusCode.Created).send(trainingType);
    } catch (e) {
        next(e);
    }
}

/**
 * Updates a training type specified by request.query.id
 * @param request
 * @param response
 * @param next
 */
async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.training_types.edit");

        const training_type_id = request.params.id;
        const body = request.body as {
            name: string;
            type: (typeof TRAINING_TYPES_TABLE_TYPES)[number];
            log_template_id?: string;
            description?: string;
        };

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            type: [
                ValidationTypeEnum.NON_NULL,
                {
                    option: ValidationTypeEnum.IN_ARRAY,
                    value: TRAINING_TYPES_TABLE_TYPES,
                },
            ],
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
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a station to a training type
 * @param request
 * @param response
 * @param next
 */
async function addStation(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.training_types.edit");

        const body = request.body as { training_station_id: string; training_type_id: string };
        Validator.validate(body, {
            training_station_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            training_type_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

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
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a station from a training type
 * @param request
 * @param response
 * @param next
 */
async function removeStation(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.training_types.edit");

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
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getByID,
    create,
    update,
    addStation,
    removeStation,
};
