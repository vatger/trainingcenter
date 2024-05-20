import { NextFunction, Request, Response } from "express";
import { TrainingLog } from "../../models/TrainingLog";
import { HttpStatusCode } from "axios";
import { User } from "../../models/User";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Gets a training log by its UUID. Includes the content and the author of the log.
 * Should only be viewable by the trainee in question, or by mentors.
 * @param request
 * @param response
 * @param next
 */
async function getByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { uuid: string };

        const trainingLog = await TrainingLog.findOne({
            where: {
                uuid: params.uuid,
            },
            include: [TrainingLog.associations.author],
        });

        if (trainingLog == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        if (!(await trainingLog.userCanRead(user))) {
            throw new ForbiddenException("You are not permitted to view this training log.");
        }

        response.send(trainingLog);
    } catch (e) {
        next(e);
    }
}

export default { getByUUID };
