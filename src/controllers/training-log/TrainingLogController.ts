import { NextFunction, Request, Response } from "express";
import { TrainingLog } from "../../models/TrainingLog";
import { HttpStatusCode } from "axios";

async function getByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { uuid: string };

        const trainingLog = await TrainingLog.findOne({
            where: {
                uuid: params.uuid,
            },
        });

        if (trainingLog == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(trainingLog);
    } catch (e) {
        next(e);
    }
}

export default { getByUUID };
