import { Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingSession } from "../../models/TrainingSession";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { TrainingRequest } from "../../models/TrainingRequest";
import dayjs from "dayjs";

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

    // Check if the user even exists in this session, else deny the request
    if (session?.users?.find((u: User) => u.id == user.id) == null) {
        response.status(403).send();
        return;
    }

    if (session == null) {
        response.status(404).send();
        return;
    }

    response.send(session);
}

async function withdrawFromSessionByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
    const sessionUUID: string = request.params.uuid;

    const session: TrainingSession | null = await TrainingSession.findOne({
        where: {
            uuid: sessionUUID,
        },
        include: [TrainingSession.associations.users],
    });

    if (session == null) {
        response.status(404).send({ message: "Session with this UUID not found" });
        return;
    }

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

    response.send({ message: "OK" });
}

export default {
    getByUUID,
    withdrawFromSessionByUUID,
};
