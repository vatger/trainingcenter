import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
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
import { TrainingLog } from "../../models/TrainingLog";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { sequelize } from "../../core/Sequelize";
import JobLibrary, { JobTypeEnum } from "../../libraries/JobLibrary";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { Op } from "sequelize";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Creates a new training session with one user and one mentor
 * @param request
 * @param response
 * @param next
 */
async function createTrainingSession(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user as User;
        const body = request.body as {
            course_uuid: string;
            date: string;
            training_type_id: string;
            user_ids: any;
            training_station_id?: string;
        };

        Validator.validate(body, {
            training_type_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            user_ids: [ValidationTypeEnum.VALID_JSON], // Parses to number[]
        });

        if (!(await user.isMentorInCourse(body.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course.");
        }

        // 1. Find out which of these users is actually enrolled in the course. To do this, query the course and it's members, and check against the array of user_ids. Create a new actual array with only those people
        // that are actually enrolled in this course.
        let courseParticipants: number[] = [];
        const course = await Course.findOne({
            where: {
                uuid: body.course_uuid,
            },
            include: [Course.associations.users],
        });

        const trainingType = await TrainingType.findOne({
            where: {
                id: body.training_type_id,
            },
        });

        if (course == null || trainingType == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        // Filter the requested users that are also enrolled in this course.
        body.user_ids?.filter((userID: number) => {
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
            mentor_id: user.id,
            training_station_id: isNaN(Number(body.training_station_id)) ? null : Number(body.training_station_id),
            date: dayjs.utc(body.date).toDate(),
            training_type_id: Number(body.training_type_id),
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
                    training_type_id: body.training_type_id,
                    status: "requested",
                },
            });

            if (request == null) {
                await TrainingRequest.create({
                    uuid: generateUUID(),
                    user_id: userID,
                    training_type_id: trainingSession.training_type_id as number, // Force number coercion, since we know that body.training_type_id is number and non null (validation)
                    course_id: course.id,
                    training_station_id: trainingSession.training_station_id,
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

        //
        // Response done, now we can send the mails
        //
        for (const userID of courseParticipants) {
            const trainee = await User.scope("sensitive").findByPk(userID);
            if (trainee == null) continue;

            await JobLibrary.scheduleJob(JobTypeEnum.EMAIL, {
                type: "message",
                recipient: trainee.email,
                subject: "New Training",
                replacements: {
                    message: {
                        name: trainee.first_name + " " + trainee.last_name,
                        message_de: `Es wurde ein neues Training am ${dayjs.utc(trainingSession.date).format(Config.DATETIME_FORMAT)} im Kurs ${
                            course.name
                        } angelegt. Wir wünschen viel Spaß und Erfolg.`,
                        message_en: "English counterpart...",
                    },
                },
            });
        }
    } catch (e: any) {
        next(e);
    }
}

/**
 * Updates a request for a given UUID
 * Should only be done by the mentor
 * @param request
 * @param response
 * @param next
 */
async function updateByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid: string };
        const body = request.body as { date?: string; mentor_id?: string; training_station_id?: string };

        Validator.validate(params, {
            uuid: [ValidationTypeEnum.NON_NULL],
        });
        Validator.validate(body, {
            date: [ValidationTypeEnum.NON_NULL],
            mentor_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const session = await TrainingSession.findOne({
            where: {
                uuid: params.uuid,
                mentor_id: user.id,
            },
        });

        if (session == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const trainingStationIDNum = Number(body.training_station_id);
        await session.update({
            mentor_id: Number(body.mentor_id),
            date: dayjs.utc(body.date).toDate(),
            training_station_id: body.training_station_id == null || trainingStationIDNum == -1 ? null : trainingStationIDNum,
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

/**
 * Deletes a training session by a mentor
 * All users that are participants of this course are placed back in the queue
 * @param request
 * @param response
 * @param next
 */
async function deleteTrainingSession(request: Request, response: Response, next: NextFunction) {
    async function notifyUser(mentor: User, participant: User, session: TrainingSession) {
        await NotificationLibrary.sendUserNotification({
            user_id: participant.id,
            author_id: mentor.id,
            message_de: `Deine Session im Kurs ${session.course?.name} am ${dayjs
                .utc(session.date)
                .format(Config.DATE_FORMAT)} wurde gelöscht. Dein Request wurde wieder in der Warteliste plaziert.`,
            message_en: `Your Session in the course ${session.course?.name} on ${dayjs
                .utc(session.date)
                .format(Config.DATE_FORMAT)} was deleted. Your Request was placed in the waiting list.`,
            severity: "danger",
            icon: "alert-triangle",
        });
    }

    try {
        const user: User = response.locals.user;
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

        for (const participant of session?.users ?? []) {
            await notifyUser(user, participant, session);
        }

        // Update training requests to reflect the now non-existent session
        await TrainingRequest.update(
            {
                status: "requested",
                training_session_id: null,
                expires: dayjs.utc().add(2, "months"),
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
    } catch (e) {
        next(e);
    }
}

/**
 * Returns the session by UUID
 * @param request
 * @param response
 * @param next
 */
async function getByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid: string };

        const id = await TrainingSession.getIDFromUUID(params.uuid);

        const trainingSession = await TrainingSession.findOne({
            where: {
                id: id,
            },
            include: [
                TrainingSession.associations.course,
                TrainingSession.associations.cpt,
                {
                    association: TrainingSession.associations.users,
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            association: User.associations.training_logs,
                            through: {
                                where: {
                                    training_session_id: id,
                                },
                                attributes: ["passed"],
                            },
                            attributes: ["uuid"],
                        },
                    ],
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

        if (!trainingSession.userCanRead(user)) {
            throw new ForbiddenException("You are not allowed to view this training session");
        }

        response.send(trainingSession);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns all the planned sessions of the current user as either mentor or CPT examiner
 * The differentiation between mentor & examiner must be done in the frontend
 * @param _request
 * @param response
 * @param next
 */
async function getPlanned(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        let trainingSession = await TrainingSession.findAll({
            where: {
                mentor_id: user.id,
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
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all participants of a training session by UUID.
 * Can only be viewed by the mentor
 * @param request
 * @param response
 * @param next
 */
async function getParticipants(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid: string };

        const trainingSession = await TrainingSession.findOne({
            where: {
                uuid: params.uuid,
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

        if (trainingSession == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        if (!trainingSession.userCanRead(user)) {
            throw new ForbiddenException("You are not allowed to view this training session");
        }

        response.send(trainingSession.users ?? []);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets the log template for a specific training session. Used for creating log entries
 * Can be viewed by all mentors
 * @param request
 * @param response
 * @param next
 */
async function getLogTemplate(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { uuid: string };

        const session = await TrainingSession.findOne({
            where: {
                uuid: params.uuid,
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

        if (session?.training_type?.log_template == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(session.training_type.log_template);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets a list of training types associated with a course. Used for creating log entries (selecting next training type)
 * Can be viewed by all mentors
 * @param request
 * @param response
 * @param next
 */
async function getCourseTrainingTypes(request: Request, response: Response, next: NextFunction) {
    try {
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

        if (session?.course?.training_types == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(session.course.training_types);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates the log entries for all participants of the session
 * @param request
 * @param response
 * @param next
 */
async function createTrainingLogs(request: Request, response: Response, next: NextFunction) {
    // All of these steps MUST complete, else we are left in an undefined state
    const transaction = await sequelize.transaction();

    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid: string };
        const body = request.body as {
            user_id: number;
            next_training_id: number;
            course_completed: boolean;
            passed: boolean;
            user_log: any[];
        }[];

        ////////////////
        // VALIDATION //
        ////////////////

        if (body == null || body.length == 0) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        for (const entry of body) {
            Validator.validate(entry, {
                user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
                passed: [ValidationTypeEnum.NON_NULL],
                user_log: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.VALID_JSON],
                course_completed: [ValidationTypeEnum.NON_NULL],
            });

            for (const logEntry of entry.user_log) {
                if (logEntry.type == "rating") {
                    Validator.validate(logEntry, {
                        value: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
                    });
                }
            }
        }

        ///////////////
        // APP LOGIC //
        ///////////////

        const session = await TrainingSession.findOne({
            where: {
                uuid: params.uuid,
            },
            include: [TrainingSession.associations.course],
        });

        if (session == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
        }
        if (!session?.userCanCreateLogs(user)) {
            throw new ForbiddenException("You are not allowed to create logs for this session");
        }

        // Loop through all log entries
        for (const logEntry of body) {
            const user_id = logEntry.user_id;

            // Create the training log with the respective content
            const trainingLog = await TrainingLog.create(
                {
                    uuid: generateUUID(),
                    content: logEntry.user_log,
                    author_id: user.id,
                },
                {
                    transaction: transaction,
                }
            );

            // Add the training log to the user (this could be done automatically with sequelize, but is a little finicky)
            await TrainingSessionBelongsToUsers.update(
                {
                    log_id: trainingLog.id,
                    passed: logEntry.passed,
                },
                {
                    where: {
                        user_id: logEntry.user_id,
                        training_session_id: session?.id,
                    },
                    transaction: transaction,
                }
            );

            // Mark the request as completed
            await TrainingRequest.update(
                {
                    status: "completed",
                },
                {
                    where: {
                        user_id: user_id,
                        training_session_id: session.id,
                    },
                    transaction: transaction,
                }
            );

            // Set the course as completed (or not) depending on the course_completion flag
            await UsersBelongsToCourses.update(
                {
                    completed: logEntry.course_completed,
                    next_training_type: logEntry.course_completed ? null : logEntry.next_training_id,
                },
                {
                    where: {
                        user_id: logEntry.user_id,
                        course_id: session.course?.id ?? -1,
                        completed: false,
                    },
                    transaction: transaction,
                }
            );

            // If the course is marked as completed, let the user know!
            if (logEntry.course_completed) {
                await NotificationLibrary.sendUserNotification({
                    user_id: user_id,
                    author_id: user.id,
                    message_de: `Der Kurs ${session.course?.name ?? "N/A"} wurde als abgeschlossen markiert`,
                    message_en: `The Course ${session.course?.name ?? "N/A"} was marked as complete`,
                    icon: "check",
                    severity: "success",
                });
            }
        }

        await TrainingSession.update(
            {
                completed: true,
            },
            {
                where: {
                    id: session.id,
                },
                transaction: transaction,
            }
        );

        await transaction.commit();
        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        await transaction.rollback();
        next(e);
    }
}

/**
 * Returns all the available mentors within a course from a training session
 * @param request
 * @param response
 * @param next
 */
async function getAvailableMentorsByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { uuid: string };

        // Find the training request, so we can find the course!
        const trainingSession = await TrainingSession.findOne({
            where: {
                uuid: params.uuid,
            },
        });

        if (trainingSession == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const mentorGroups = await trainingSession.getAvailableMentorGroups();

        let mentors: any[] = [];

        for (const mentorGroup of mentorGroups) {
            for (const user of mentorGroup.users ?? []) {
                if (mentors.find(u => u.id == user.id) == null) {
                    mentors.push(user);
                }
            }
        }

        response.send(mentors);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns all training sessions in which the current user is marked as the mentor
 * @param _request
 * @param response
 * @param next
 */
async function getMyTrainingSessions(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const sessions = await TrainingSession.findAll({
            where: {
                mentor_id: user.id,
            },
            include: [TrainingSession.associations.users, TrainingSession.associations.course, TrainingSession.associations.training_type],
        });

        response.send(sessions);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all upcoming training sessions (even those from other mentors)
 * Useful to check for date conflicts
 * Accessible by all mentors
 * @param _request
 * @param response
 * @param next
 */
async function getAllUpcoming(_request: Request, response: Response, next: NextFunction) {
    try {
        let sessions: TrainingSession[] = await TrainingSession.findAll({
            where: {
                date: {
                    [Op.gt]: dayjs.utc().toDate(),
                },
            },
            attributes: ["uuid", "mentor_id", "date"],
            include: [
                {
                    association: TrainingSession.associations.training_type,
                    attributes: ["id", "name", "type"],
                    through: {
                        attributes: [],
                    },
                },
                {
                    association: TrainingSession.associations.course,
                    attributes: ["uuid", "name"],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        const res = sessions.map(session => ({
            date: session.date,
            training_type: session.training_type,
            course_name: session.course?.name,
        }));

        response.send(res);
    } catch (e) {
        next(e);
    }
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
    getAvailableMentorsByUUID,
    getMyTrainingSessions,
    getAllUpcoming,
};
