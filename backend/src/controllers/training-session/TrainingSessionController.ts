import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingSession } from "../../models/TrainingSession";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { TrainingRequest } from "../../models/TrainingRequest";
import dayjs from "dayjs";
import NotificationLibrary from "../../libraries/notification/NotificationLibrary";
import { HttpStatusCode } from "axios";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Gets a list of upcoming training sessions
 * @param _request
 * @param response
 * @param next
 */
async function getUpcoming(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const sessions: TrainingSession[] = (await user.getTrainingSessionsWithCourseAndStation()).filter(session => {
            return !session.completed && dayjs.utc(session.date).isAfter(dayjs.utc());
        });

        response.send(sessions);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets a list of completed trainings
 * @param _request
 * @param response
 * @param next
 */
async function getCompleted(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const sessions = (await user.getTrainingSessionsWithCourseAndStation())
            .filter(session => {
                return session.completed;
            })
            .map(session => ({
                uuid: session.uuid,
                mentor_id: session.mentor_id,
                date: session.date,
                course: {
                    name: session.course?.name,
                },
                training_type: {
                    name: session.training_type?.name,
                    type: session.training_type?.type,
                },
                training_station: session.training_station ?? null,
            }));

        response.send(sessions);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all the associated data of a training session
 * @param request
 * @param response
 * @param next
 */
async function getByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const sessionUUID: string = request.params.uuid;

        const session: TrainingSession | null = await TrainingSession.findOne({
            where: {
                uuid: sessionUUID,
            },
            include: [
                {
                    association: TrainingSession.associations.users,
                    attributes: ["id"],
                    through: { attributes: [] },
                },
                {
                    association: TrainingSession.associations.mentor,
                },
                {
                    association: TrainingSession.associations.cpt,
                },
                {
                    association: TrainingSession.associations.training_type,
                    attributes: ["id", "name", "type"],
                },
                {
                    association: TrainingSession.associations.training_station,
                    attributes: ["id", "callsign", "frequency"],
                },
                {
                    association: TrainingSession.associations.course,
                    attributes: ["uuid", "name", "name_en"],
                },
            ],
        });

        // Check if the session exists
        if (session == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        // Check if the user even exists in this session, else deny the request
        if (!session.isUserParticipant(user)) {
            throw new ForbiddenException("You don't have permission to view this session", true);
        }

        const requestingUserPassed = await TrainingSessionBelongsToUsers.findOne({
            where: {
                user_id: user.id,
                training_session_id: session.id,
            },
            include: [
                {
                    association: TrainingSessionBelongsToUsers.associations.training_log,
                    attributes: ["uuid"],
                },
            ],
        });

        response.send({
            ...session.toJSON(),
            user_passed: requestingUserPassed == null ? null : requestingUserPassed.passed,
            log_id: requestingUserPassed?.training_log?.uuid ?? null,
        });
    } catch (e) {
        next(e);
    }
}

/**
 * Removes the requesting user from a session by its UUID
 * If the user is the only participant, deletes the entire training session
 * @param request
 * @param response
 * @param next
 */
async function withdrawFromSessionByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const sessionUUID: string = request.params.uuid;

        const session: TrainingSession | null = await TrainingSession.findOne({
            where: {
                uuid: sessionUUID,
            },
            include: [TrainingSession.associations.users, TrainingSession.associations.training_type],
        });

        if (session == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        if (!session.isUserParticipant(user)) {
            throw new ForbiddenException("You are not a participant of this session");
        }

        // Update the request to reflect this change
        await TrainingRequest.update(
            {
                status: "requested",
                training_session_id: null,
                expires: dayjs().add(2, "months").toDate(),
            },
            {
                where: {
                    user_id: user.id,
                    training_session_id: session.id,
                },
            }
        );

        // Delete the association between trainee and session
        // only if the session hasn't been completed (i.e. passed == null && log_id == null)
        await TrainingSessionBelongsToUsers.destroy({
            where: {
                user_id: user.id,
                training_session_id: session.id,
                passed: null,
                log_id: null,
            },
        });

        // Check if we can delete the entire session, or only the user
        if (session.users?.length == 1) {
            await session.destroy();
        }

        if (session.mentor_id) {
            await NotificationLibrary.sendUserNotification({
                user_id: session.mentor_id,
                message_de: `${user.first_name} ${user.last_name} (${user.id}) hat sich von der geplanten Session (${session.training_type?.name}) am ${dayjs(
                    session.date
                ).format("DD.MM.YYYY")} abgemeldet`,
                message_en: `${user.first_name} ${user.last_name} (${user.id}) withdrew from the planned session (${session.training_type?.name}) on ${dayjs(
                    session.date
                ).format("DD.MM.YYYY")}`,
                severity: "danger",
                icon: "door-exit",
            });
        }

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

export default {
    getUpcoming,
    getCompleted,
    getByUUID,
    withdrawFromSessionByUUID,
};
