import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingRequest } from "../../models/TrainingRequest";
import { generateUUID } from "../../utility/UUID";
import { TrainingSession } from "../../models/TrainingSession";
import dayjs from "dayjs";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { HttpStatusCode } from "axios";

/**
 * Creates a new training request
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const body = request.body as {
        course_id: number;
        training_type_id: number;
        comment?: string;
        training_station_id?: number;
    };
    const user: User = response.locals.user;

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "course_id",
    //         validationObject: requestData.course_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "training_type_id",
    //         validationObject: requestData.training_type_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

    const trainingRequest = await TrainingRequest.create({
        uuid: generateUUID(),
        user_id: user.id,
        training_type_id: body.training_type_id,
        course_id: body.course_id ?? -1,
        training_station_id: body.training_station_id ?? null,
        status: "requested",
        comment: body.comment?.length == 0 ? null : body.comment,
        expires: dayjs().add(2, "month").toDate(), // Expires in 2 months from now
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
    const user: User = response.locals.user;
    const body = request.body as { uuid: string };

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "training_request_uuid",
    //         validationObject: training_request_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

    const trainingRequest = await TrainingRequest.findOne({
        where: {
            uuid: body.uuid,
            user_id: user.id,
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
 * Gets all training requests for the currently logged-in user
 * @param request
 * @param response
 */
async function getOpen(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const trainingRequests = await TrainingRequest.findAll({
        where: {
            user_id: reqUser.id,
            status: "requested",
        },
        include: [TrainingRequest.associations.training_type, TrainingRequest.associations.course],
    });

    for (const trainingRequest of trainingRequests) {
        await trainingRequest.appendNumberInQueue();
    }

    response.send(trainingRequests);
}

/**
 * Gets all planned training sessions for the requesting user
 * @param request
 * @param response
 */
async function getPlanned(request: Request, response: Response) {
    const user: User = response.locals.user;

    const sessions: TrainingSessionBelongsToUsers[] = await TrainingSessionBelongsToUsers.findAll({
        where: {
            user_id: user.id,
            passed: null,
        },
        attributes: ["id", "user_id", "createdAt"],
        include: [
            {
                association: TrainingSessionBelongsToUsers.associations.training_session,
                include: [
                    TrainingSession.associations.mentor,
                    {
                        association: TrainingSession.associations.training_station,
                        attributes: ["id", "callsign", "frequency"],
                    },
                    {
                        association: TrainingSession.associations.training_type,
                        attributes: ["id", "name"],
                    },
                ],
                attributes: ["uuid", "mentor_id", "date", "createdAt"],
            },
        ],
    });

    response.send(sessions);
}

async function getByUUID(request: Request, response: Response) {
    const reqData = request.params;

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "training_request_uuid",
    //         validationObject: reqData.request_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

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

async function confirmInterest(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { token: string };
        const token = atob(body.token).split(".");

        console.log(token);
        if (body.token == null || token.length != 3) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }
        const trainingRequestUUID = token[0];
        const cid = Number(token[1]);
        const timestamp = Number(token[2]);

        const trainingRequest = await TrainingRequest.findOne({
            where: {
                uuid: trainingRequestUUID,
            },
        });

        if (trainingRequest == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const djsExpires = dayjs.utc(trainingRequest.expires);
        if (trainingRequest.user_id != cid || djsExpires.unix() != timestamp || djsExpires.isAfter(dayjs.utc())) {
            // Check if the CID doesn't match or
            // the timestamps don't match
            // or the expiry is already in the future, in which case the token was reverse-engineered (it isn't really that difficult tbh :D) and not to be used
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        await trainingRequest.update({
            expires: dayjs.utc().add(2, "months"),
        });

        response.send(trainingRequest);
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    destroy,
    getOpen,
    getPlanned,
    getByUUID,
    confirmInterest,
};
