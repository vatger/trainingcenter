import { Request, Response } from "express";
import { User } from "../../models/User";
import _TrainingSessionAdminValidator from "./_TrainingSessionAdminValidator";
import { Course } from "../../models/Course";
import { TrainingSession } from "../../models/TrainingSession";
import { generateUUID } from "../../utility/UUID";
import dayjs from "dayjs";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { HttpStatusCode } from "axios";
import NotificationLibrary from "../../libraries/notification/NotificationLibrary";
import { Config } from "../../core/Config";
import { TrainingType } from "../../models/TrainingType";
import { Op } from "sequelize";
import { TrainingLog } from "../../models/TrainingLog";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";

/**
 * Creates a new training session with one user and one mentor
 */
async function createTrainingSession(request: Request, response: Response) {
    // TODO: Check if the mentor of the course is even allowed to create such a session!

    const requestUser: User = request.body.user as User;
    const data = request.body.data as { course_uuid?: string; date?: string; training_type_id?: number; training_station_id?: number; user_ids?: number[] };

    const validation = _TrainingSessionAdminValidator.validateCreateSessionRequest(data);

    if (validation.invalid) {
        response.status(400).send({
            validation: validation.message,
            validation_failed: true,
        });
        return;
    }

    // 1. Find out which of these users is actually enrolled in the course. To do this, query the course and it's members, and check against the array of user_ids. Create a new actual array with only those people
    // that are actually enrolled in this course.
    let courseParticipants: number[] = [];
    const course = await Course.findOne({
        where: {
            uuid: data.course_uuid,
        },
        include: [Course.associations.users],
    });

    if (course == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    // Filter the requested users that are also enrolled in this course.
    data.user_ids?.filter(userID => {
        if (course.users?.find(courseUser => courseUser.id == userID)) {
            courseParticipants.push(userID);
        }
    });

    if (courseParticipants.length == 0) {
        response.status(HttpStatusCode.BadRequest).send({ error: "No specified user was a member of this course." });
        return;
    }

    // Create Session
    const trainingSession = await TrainingSession.create({
        uuid: generateUUID(),
        mentor_id: requestUser.id,
        training_station_id: data.training_station_id,
        date: dayjs.utc(data.date).toDate(),
        training_type_id: data.training_type_id,
        course_id: course.id,
    });

    if (trainingSession == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    // For each one of these members, delete their training requests from the course and training_type_id.
    for (const userID of courseParticipants) {
        const request = await TrainingRequest.findOne({
            where: {
                user_id: userID,
                course_id: course.id,
                training_type_id: data.training_type_id,
                status: "requested",
            },
        });

        if (request == null) {
            await TrainingRequest.create({
                uuid: generateUUID(),
                user_id: userID,
                training_type_id: data.training_type_id,
                course_id: course.id,
                training_station_id: data.training_station_id,
                status: "planned",
                expires: dayjs().add(1, "month").toDate(),
                training_session_id: trainingSession.id,
            });
        } else {
            await request.update({
                status: "planned",
                training_session_id: trainingSession.id,
            });
        }

        await TrainingSessionBelongsToUsers.create({
            training_session_id: trainingSession.id,
            user_id: userID,
        });
    }

    response.send(trainingSession);
}

async function updateByUUID(request: Request, response: Response) {
    const user = request.body.user;
    const sessionUUID = request.params.uuid;
    const data = request.body as { date: string; training_station: string };

    const session = await TrainingSession.findOne({
        where: {
            uuid: sessionUUID,
        },
    });

    if (session == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    await session.update({
        date: dayjs.utc(data.date).toDate(),
        training_station_id: data.training_station == "-1" ? null : Number(data.training_station),
    });

    response.sendStatus(HttpStatusCode.Ok);
}

/**
 * Deletes a training session by a mentor
 * All users that are participants of this course are placed back in the queue
 */
async function deleteTrainingSession(request: Request, response: Response) {
    const user: User = request.body.user;
    const data = request.body as { training_session_id: number };

    const session = await TrainingSession.findOne({
        where: {
            id: data.training_session_id,
            mentor_id: user.id,
        },
        include: [TrainingSession.associations.users, TrainingSession.associations.course],
    });

    if (session == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    session.users?.forEach(participant => {
        NotificationLibrary.sendUserNotification({
            user_id: participant.id,
            author_id: user.id,
            message_de: `Deine Session im Kurs ${session.course?.name} am ${dayjs
                .utc(session.date)
                .format(Config.DATE_FORMAT)} wurde gelöscht. Dein Request wurde wieder in der Warteliste plaziert.`,
            message_en: `Your Session in the course ${session.course?.name} on ${dayjs
                .utc(session.date)
                .format(Config.DATE_FORMAT)} was deleted. Your Request was placed in the waiting list.`,
            severity: "danger",
            icon: "alert-triangle",
        });
    });

    // Update training requests to reflect the now non-existent session
    await TrainingRequest.update(
        {
            status: "requested",
            training_session_id: null,
        },
        {
            where: {
                training_session_id: session.id,
            },
        }
    );

    // Destroying the session also destroys the related training_session_belongs_to_users
    // entries with this course, due to their foreign relationships
    await session.destroy();

    response.sendStatus(HttpStatusCode.NoContent);
}

async function getByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
    const params = request.params as { uuid: string };

    const trainingSession = await TrainingSession.findOne({
        where: {
            uuid: params.uuid,
        },
        include: [
            TrainingSession.associations.course,
            {
                association: TrainingSession.associations.users,
                through: {
                    attributes: [],
                },
            },
            {
                association: TrainingSession.associations.training_type,
                include: [
                    {
                        association: TrainingType.associations.training_stations,
                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
            TrainingSession.associations.training_station,
        ],
    });

    if (trainingSession == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    response.send(trainingSession);
}

/**
 * Returns all the planned sessions of the current user as either mentor or CPT examiner
 * The differentiation between mentor & examiner must be done in the frontend
 * @param request
 * @param response
 */
async function getPlanned(request: Request, response: Response) {
    const user: User = request.body.user;

    let trainingSession = await TrainingSession.findAll({
        where: {
            [Op.or]: {
                mentor_id: user.id,
                cpt_examiner_id: user.id,
            },
            completed: false,
        },
        order: [["date", "asc"]],
        include: [
            TrainingSession.associations.course,
            TrainingSession.associations.training_type,
            {
                association: TrainingSession.associations.training_session_belongs_to_users,
                attributes: ["log_id"],
            },
        ],
    });

    response.send(trainingSession);
}

async function getParticipants(request: Request, response: Response) {
    const user: User = request.body.user;
    const params = request.params as { uuid: string };

    const session = await TrainingSession.findOne({
        where: {
            uuid: params.uuid,
            [Op.or]: {
                mentor_id: user.id,
                cpt_examiner_id: user.id,
            },
        },
        include: [
            {
                association: TrainingSession.associations.users,
                through: {
                    attributes: [],
                },
            },
        ],
    });

    if (session == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    response.send(session.users ?? []);
}

async function getLogTemplate(request: Request, response: Response) {
    const user: User = request.body.user;
    const params = request.params as { uuid: string };

    const session = await TrainingSession.findOne({
        where: {
            uuid: params.uuid,
            [Op.or]: {
                mentor_id: user.id,
                cpt_examiner_id: user.id,
            },
        },
        include: {
            association: TrainingSession.associations.training_type,
            include: [
                {
                    association: TrainingType.associations.log_template,
                },
            ],
        },
    });

    if (session == null || session.training_type?.log_template == null) {
        response.sendStatus(HttpStatusCode.NotFound);
        return;
    }

    response.send(session.training_type?.log_template);
}

async function getCourseTrainingTypes(request: Request, response: Response) {
    const user: User = request.body.user;
    const params = request.params as { uuid: string };

    const session = await TrainingSession.findOne({
        where: {
            uuid: params.uuid,
        },
        include: [
            {
                association: TrainingSession.associations.course,
                include: [
                    {
                        association: Course.associations.training_types,
                        attributes: ["id", "name", "type"],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
        ],
    });

    if (session == null || session.course?.training_types == null) {
        response.sendStatus(HttpStatusCode.NotFound);
        return;
    }

    response.send(session.course?.training_types);
}

async function createTrainingLogs(request: Request, response: Response) {
    const user: User = request.body.user;
    const params = request.params as { uuid: string };
    const body = request.body as { user_id: number; next_training_id: number; log_public: boolean; passed: boolean; user_log: any[] }[];

    if (body == null || body.length == 0) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    const session = await TrainingSession.findOne({
        where: {
            uuid: params.uuid,
        },
        include: [TrainingSession.associations.course],
    });

    if (session == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    for (let i = 0; i < body.length; i++) {
        const user_id = body[i].user_id;

        const trainingLog = await TrainingLog.create({
            uuid: generateUUID(),
            content: body[i].user_log,
            log_public: body[i].log_public,
            author_id: user.id,
        });

        await TrainingSessionBelongsToUsers.update(
            {
                log_id: trainingLog.id,
                passed: body[i].passed,
            },
            {
                where: {
                    user_id: body[i].user_id,
                    training_session_id: session?.id,
                },
            }
        );

        await TrainingRequest.update(
            {
                status: "completed",
            },
            {
                where: {
                    user_id: user_id,
                    training_session_id: session.id,
                },
            }
        );

        await UsersBelongsToCourses.update(
            {
                next_training_type: body[i].next_training_id,
            },
            {
                where: {
                    user_id: body[i].user_id,
                    course_id: session.course?.id ?? -1,
                    completed: false,
                },
            }
        );
    }

    await session.update({
        completed: true,
    });

    response.sendStatus(HttpStatusCode.Ok);
}

export default {
    getByUUID,
    createTrainingSession,
    updateByUUID,
    getParticipants,
    getLogTemplate,
    deleteTrainingSession,
    createTrainingLogs,
    getCourseTrainingTypes,
    getPlanned,
};
