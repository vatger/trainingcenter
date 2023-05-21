import { CookieOptions, Request, Response } from "express";
import { UserSession } from "../../models/UserSession";
import { generateUUID } from "../../utility/UUID";
import { Config } from "../../core/Config";
import Logger, { LogLevels } from "../../utility/Logger";
import dayjs from "dayjs";

/**
 * Creates and stores a new session token in the database
 * @param response
 * @param user_id
 * @param remember
 */
export async function createSessionToken(response: Response, user_id: number, remember: boolean = false): Promise<boolean> {
    const session_uuid: string = generateUUID();
    const expiration: Date = remember ? dayjs().add(7, "day").toDate() : dayjs().add(20, "minute").toDate();
    const expiration_latest: Date = remember ? dayjs().add(1, "month").toDate() : dayjs().add(1, "hour").toDate();

    const cookie_options: CookieOptions = {
        signed: true,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: expiration,
    };

    const session: UserSession = await UserSession.create({
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

/**
 * Removes the current session's token from the database
 * @param request
 * @param response
 */
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

/**
 * Validates the current session using the signed cookie
 * @param request
 * @returns true if the current session is valid, false if the current session is invalid (or doesn't exist)
 */
async function validateSessionToken(request: Request): Promise<UserSession | null> {
    const session_token = request.signedCookies[Config.SESSION_COOKIE_NAME];
    const now = dayjs();

    // Check if token is present
    if (session_token == null || session_token == false) return null;

    // Get session from Database
    const session: UserSession | null = await UserSession.findOne({
        where: {
            uuid: session_token,
        },
    });

    // Check if session exists
    if (session == null) return null;

    const expires_at = dayjs(session.expires_at);
    const expires_latest = dayjs(session.expires_latest);

    // Session is valid
    if (expires_at.isAfter(now)) return session;

    // Session is invalid, but we can update the time (assuming the session's latest expiration
    // is more than 20 minutes in the future). Else we might assign an expired_at time which is
    // after the expires_latest time. Not really what we want!
    if (expires_latest.isAfter(now) && dayjs().add(20, "minute").isBefore(expires_latest)) {
        return await session.update({
            expires_at: now.add(20, "minute").toDate(),
        });
    }

    // Session is invalid, and we can't update -> invalidate session
    await session.destroy();
    return null;
}

export default {
    validateSessionToken,
};
