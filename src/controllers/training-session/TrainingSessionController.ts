import { Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingSession } from "../../models/TrainingSession";

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
            uuid: sessionUUID
        },
        include: [
            {
                association: TrainingSession.associations.users,
                attributes: ["id"],
                through: {attributes: []}
            },
            TrainingSession.associations.mentor,
            TrainingSession.associations.cpt_examiner,
            TrainingSession.associations.training_type,
            TrainingSession.associations.training_station,
            TrainingSession.associations.course
        ]
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

export default {
    getByUUID
}