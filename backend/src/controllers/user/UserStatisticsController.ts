import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { User } from "../../models/User";
import { localCache } from "../../core/Cache";

// TODO: The entire statistics controller should ideally cache the data for at least a day (the hours really don't change that much).
//  That way we can drastically reduce load times and the chance of getting blocked by VATSIM (again).

async function getUserRatingTimes(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        let userID = user.id;

        if (localCache.has(userID)) {
            response.send(localCache.get(userID));
            return;
        }

        const res = await axios.get(`https://api.vatsim.net/v2/members/${userID}/stats`);
        localCache.set(userID, res.data);
        response.send(res.data);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns the number of sessions of the requesting user (including planned afaik)
 * @param request
 * @param response
 * @param next
 */
async function getUserTrainingSessionCount(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const sessions = await user.getTrainingSessions();
        const completedSession = sessions.filter(s => s.completed);

        response.send({ count: sessions.length, completedCount: completedSession.length });
    } catch (e) {
        next(e);
    }
}

export default {
    getUserRatingTimes,
    getUserTrainingSessionCount,
};
