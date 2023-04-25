import { CookieOptions, Request, Response } from "express";
import moment from "moment";
import { UserSession } from "../../models/UserSession";
import { generateUUID } from "../../utility/UUID";
import { Config } from "../../core/Config";
import Logger, { LogLevels } from "../../utility/Logger";
import { User } from "../../models/User";
import { Role } from "../../models/Role";

export async function createSessionToken(response: Response, user_id: number, remember: boolean = false): Promise<boolean> {
    const session_uuid = generateUUID();
    const expiration: Date = remember ? moment().add({ day: 7 }).toDate() : moment().add({ minute: 20 }).toDate();
    const expiration_latest: Date = remember ? moment().add({ month: 1 }).toDate() : moment().add({ hour: 1 }).toDate();

    const cookie_options: CookieOptions = {
        signed: true,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: expiration,
    };

    const session = await UserSession.create({
        uuid: session_uuid.toString(),
        user_id: user_id,
        expires_at: expiration,
        expires_latest: expiration_latest,
    });

    if (session != null) {
        response.cookie(Config.SESSION_COOKIE_NAME, session_uuid, cookie_options);
        return true;
    }

    if (Config.APP_DEBUG) Logger.log(LogLevels.LOG_WARN, "Session is null / undefined. No cookie has been set!\n");

    return false;
}

export async function removeSessionToken(request: Request, response: Response) {
    const session_token = request.signedCookies[Config.SESSION_COOKIE_NAME];

    if (session_token != null) {
        await UserSession.destroy({
            where: {
                uuid: session_token,
            },
        });
    }

    response.clearCookie(Config.SESSION_COOKIE_NAME);
}

export async function validateSessionToken(request: Request): Promise<boolean> {
    const session_token = request.signedCookies[Config.SESSION_COOKIE_NAME];
    const now = moment();

    // Check if token is present
    if (session_token == null || session_token == false) return false;

    // Get session from Database
    const session = await UserSession.findOne({
        where: {
            uuid: session_token,
        },
    });

    // Check if session exists
    if (session == null) return false;

    const expires_at = moment(session.expires_at);
    const expires_latest = moment(session.expires_latest);

    // Session is valid
    if (expires_at.isAfter(now)) return true;

    // Session is invalid, but we can update the time (assuming the session's latest expiration
    // is more than 20 minutes in the future). Else we might assign an expired_at time which is
    // after the expires_latest time. Not really what we want!
    if (expires_latest.isAfter(now) && moment().add({ minute: 20 }).isBefore(expires_latest)) {
        await session.update({
            expires_at: now.add({ minute: 20 }).toDate(),
        });

        return true;
    }

    // Session is invalid, and we can't update -> invalidate session
    await session.destroy();
    return false;
}

async function getUserIdFromSession(request: Request): Promise<number> {
    const session_token = request.signedCookies[Config.SESSION_COOKIE_NAME];

    if (session_token == null || session_token == false) return 0;
    if (!(await validateSessionToken(request))) return 0;

    const session = await UserSession.findOne({
        where: {
            uuid: session_token,
        },
    });

    if (session == null) return 0;

    return session.user_id;
}

async function getUserFromSession(request: Request): Promise<User | null> {
    const user_id = await getUserIdFromSession(request);
    if (user_id == 0) return null;

    return await User.findOne({
        where: {
            id: user_id,
        },
        include: {
            association: User.associations.roles,
            attributes: ["name"],
            through: {
                attributes: [],
            },
            include: [
                {
                    association: Role.associations.permissions,
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    },
                },
            ],
        },
    });
}

export default {
    getUserFromSession,
    getUserIdFromSession,
};
