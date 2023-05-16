import { Request, Response } from "express";
import { User } from "../../models/User";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { TrainingRequest } from "../../models/TrainingRequest";
import { generateUUID } from "../../utility/UUID";
import { TrainingSession } from "../../models/TrainingSession";
import dayjs from "dayjs";

/**
 * Creates a new training request
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const requestData: { course_id: number; training_type_id: number; comment?: string; training_station_id?: number } = request.body.data;
    const requestUser: User = request.body.user;

    const validation = ValidationHelper.validate([
        {
            name: "course_id",
            validationObject: requestData.course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "training_type_id",
            validationObject: requestData.training_type_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const trainingRequest = await TrainingRequest.create({
        uuid: generateUUID(),
        user_id: requestUser.id,
        training_type_id: requestData.training_type_id,
        course_id: requestData.course_id ?? -1,
        training_station_id: requestData.training_station_id ?? null,
        status: "requested",
        comment: requestData.comment?.length == 0 ? null : requestData.comment,
        expires: dayjs().add(1, "month").toDate(),
    });

    if (trainingRequest == null) {
        response.status(500).send({ message: "Failed to create training request" });
        return;
    }

    const trainingRequestTrainingType = await trainingRequest.getTrainingType();
    const trainingRequestTrainingStation = await trainingRequest.getTrainingStation();
    response.send({
        ...trainingRequest.dataValues,
        training_type: trainingRequestTrainingType,
        training_station: trainingRequestTrainingStation,
    });
}

/**
 * Destroys a training request based on the UUID and user id (CID)
 * @param request
 * @param response
 */
async function destroy(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const training_request_uuid: string | undefined = request.body.data?.request_uuid?.toString();

    const validation = ValidationHelper.validate([
        {
            name: "training_request_uuid",
            validationObject: training_request_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const trainingRequest = await TrainingRequest.findOne({
        where: {
            uuid: training_request_uuid,
            user_id: reqUser.id,
        },
    });
    if (trainingRequest == null) {
        response.status(500).send({ message: "Training request could not be found, or is not linked to the requesting user." });
        return;
    }

    await trainingRequest.destroy();
    response.send({ message: "OK" });
}

/**
 * Gets all training requests for the currently logged in user
 * @param request
 * @param response
 */
async function getOpen(request: Request, response: Response) {
    const reqUser: User = request.body.user;

    const trainingRequests = await TrainingRequest.findAll({
        where: {
            user_id: reqUser.id,
        },
        include: [TrainingRequest.associations.training_type, TrainingRequest.associations.course],
    });

    response.send(trainingRequests);
}

async function getByUUID(request: Request, response: Response) {
    const reqData = request.params;

    const validation = ValidationHelper.validate([
        {
            name: "training_request_uuid",
            validationObject: reqData.request_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const trainingRequest = await TrainingRequest.findOne({
        where: {
            uuid: reqData.request_uuid?.toString(),
        },
        include: [
            TrainingRequest.associations.training_type,
            TrainingRequest.associations.course,
            TrainingRequest.associations.training_station,
            {
                association: TrainingRequest.associations.training_session,
                include: [TrainingSession.associations.mentor],
            },
        ],
    });

    response.send(trainingRequest);
}

export default {
    create,
    destroy,
    getOpen,
    getByUUID,
};
