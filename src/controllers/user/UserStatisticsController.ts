import { NextFunction, Request, Response } from "express";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { User } from "../../models/User";
import Logger, { LogLevels } from "../../utility/Logger";

// TODO: The entire statistics controller should ideally cache the data for at least a day (the hours really don't change that much).
//  That way we can drastically reduce load times and the chance of getting blocked by VATSIM (again).

async function getUserRatingTimes(request: Request, response: Response, next: NextFunction) {
    const user: User = response.locals.user;
    try {
        const res = await axios.get(`https://api.vatsim.net/v2/members/${user.id}/stats`);
        response.send(res.data);
    } catch (e: any) {
        Logger.log(LogLevels.LOG_WARN, `Failed to retrieve API Statistics for ${user.id}: ${e.message}`);
        response.sendStatus(HttpStatusCode.InternalServerError);
    }
}

async function getUserTrainingSessionCount(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const sessions = await user.getTrainingSessions();
        const completedSession = sessions.filter(s => s.completed);

        response.send({count: sessions.length, completedCount: completedSession.length});
    } catch (e) {
        next(e);
    }
}

export default {
    getUserRatingTimes,
    getUserTrainingSessionCount
};
