import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingRequest } from "../../models/TrainingRequest";
import { generateUUID } from "../../utility/UUID";
import { TrainingSession } from "../../models/TrainingSession";
import dayjs from "dayjs";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { HttpStatusCode } from "axios";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { GenericException } from "../../exceptions/GenericException";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { ConversionUtils } from "turbocommons-ts";
import { Course } from "../../models/Course";

/**
 * Creates a new training request
 * @param request
 * @param response
 * @param next
 */
async function create(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as {
            course_id: number;
            training_type_id: number;
            comment?: string;
            training_station_id?: number;
        };

        Validator.validate(body, {
            course_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            training_type_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const courseUUID = await Course.getUUIDFromID(body.course_id);
        if (!await user.isMemberOfCourse(courseUUID)) {
            throw new ForbiddenException("You are not a member of this course");
        }

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
    } catch (e) {
        next(e);
    }
}

/**
 * Destroys a training request based on the UUID and user id (CID)
 * @param request
 * @param response
 * @param next
 */
async function destroy(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { uuid: string };

        Validator.validate(body, {
            uuid: [ValidationTypeEnum.NON_NULL],
        });

        const trainingRequest: TrainingRequest | null = await TrainingRequest.findOne({
            where: {
                uuid: body.uuid,
                user_id: user.id,
            },
        });
        if (trainingRequest == null) {
            throw new GenericException("NOT_FOUND", "Training request could not be found.");
        }

        await trainingRequest.destroy();
        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all training requests for the currently logged-in user
 * @param _request
 * @param response
 * @param next
 */
async function getOpen(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const trainingRequests = await TrainingRequest.findAll({
            where: {
                user_id: user.id,
                status: "requested",
            },
            include: [TrainingRequest.associations.training_type, TrainingRequest.associations.course],
        });

        for (const trainingRequest of trainingRequests) {
            await trainingRequest.appendNumberInQueue();
        }

        response.send(trainingRequests);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all planned training sessions for the requesting user
 * @param _request
 * @param response
 * @param next
 */
async function getPlanned(_request: Request, response: Response, next: NextFunction) {
    try {
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
    } catch (e) {
        next(e);
    }
}

/**
 * Returns the information of a training request by its UUID
 * @param request
 * @param response
 * @param next
 */
async function getByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid?: string };

        const trainingRequest = await TrainingRequest.findOne({
            where: {
                uuid: params.uuid?.toString(),
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

        if (!(await trainingRequest?.canUserView(user))) {
            throw new ForbiddenException("You are not allowed to view this training request");
        }

        response.send(trainingRequest);
    } catch (e) {
        next(e);
    }
}

/**
 * Confirms the interest for a training request
 * @param request
 * @param response
 * @param next
 */
async function confirmInterest(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { token: string };
        const token = ConversionUtils.base64ToString(body.token).split(".");

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
                user_id: user.id,
            },
        });

        const djsExpires = dayjs.utc(trainingRequest?.expires);
        if (trainingRequest == null || trainingRequest.user_id != cid || djsExpires.unix() != timestamp || djsExpires.isAfter(dayjs.utc())) {
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
