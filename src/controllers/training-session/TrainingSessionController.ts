import { Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingSession } from "../../models/TrainingSession";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { TrainingRequest } from "../../models/TrainingRequest";
import dayjs from "dayjs";
import NotificationLibrary from "../../libraries/notification/NotificationLibrary";
import { HttpStatusCode } from "axios";

/**
 * [User]
 * Gets all the associated data of a training session
 * @param request
 * @param response
 */
async function getByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
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
            TrainingSession.associations.mentor,
            TrainingSession.associations.cpt_examiner,
            TrainingSession.associations.training_type,
            TrainingSession.associations.training_station,
            TrainingSession.associations.course,
        ],
    });

    // Check if the session exists
    if (session == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    // Check if the user even exists in this session, else deny the request
    if (session?.users?.find((u: User) => u.id == user.id) == null) {
        response.sendStatus(HttpStatusCode.Forbidden);
        return;
    }

    const requestingUserPassed = await TrainingSessionBelongsToUsers.findOne({
        where: {
            user_id: user.id,
            training_session_id: session.id,
        },
    });

    response.send({
        ...session.toJSON(),
        user_passed: requestingUserPassed == null ? null : requestingUserPassed.passed,
    });
}

async function withdrawFromSessionByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
    const sessionUUID: string = request.params.uuid;

    const session: TrainingSession | null = await TrainingSession.findOne({
        where: {
            uuid: sessionUUID,
        },
        include: [TrainingSession.associations.users, TrainingSession.associations.training_type],
    });

    if (session == null) {
        response.status(404).send({ message: "Session with this UUID not found" });
        return;
    }

    // Update the request to reflect this change
    await TrainingRequest.update(
        {
            status: "requested",
            training_session_id: null,
            expires: dayjs().add(1, "month").toDate(),
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
}

export default {
    getByUUID,
    withdrawFromSessionByUUID,
};
