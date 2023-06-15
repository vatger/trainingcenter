import { CookieOptions, Request, Response } from "express";
import { UserSession } from "../../models/UserSession";
import { generateUUID } from "../../utility/UUID";
import { Config } from "../../core/Config";
import Logger, { LogLevels } from "../../utility/Logger";
import dayjs from "dayjs";
import UAParser from "ua-parser-js";

/**
 * Creates and stores a new session token in the database
 * @param request
 * @param response
 * @param user_id
 * @param remember
 */
export async function createSessionToken(request: Request, response: Response, user_id: number, remember: boolean = false): Promise<boolean> {
    const sessionUUID: string = generateUUID();
    const browserUUID: string | string[] | undefined = request.headers['unique-browser-token'];
    const userAgent = UAParser(request.headers["user-agent"]);

    const expiration: Date = remember ? dayjs().add(7, "day").toDate() : dayjs().add(20, "minute").toDate();
    const expiration_latest: Date = remember ? dayjs().add(1, "month").toDate() : dayjs().add(1, "hour").toDate();

    if (browserUUID == null) return false;

    const cookie_options: CookieOptions = {
        signed: true,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: expiration,
    };

    const session: UserSession = await UserSession.create({
        uuid: sessionUUID.toString(),
        browser_uuid: browserUUID.toString(),
        user_id: user_id,
        expires_at: expiration,
        expires_latest: expiration_latest,
        client: `${userAgent.os.name} / ${userAgent.browser.name} ${userAgent.browser.version}`
    });

    if (session != null) {
        response.cookie(Config.SESSION_COOKIE_NAME, sessionUUID, cookie_options);
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
    const sessionUUID = request.signedCookies[Config.SESSION_COOKIE_NAME];
    const browserUUID: string | string[] | undefined = request.headers['unique-browser-token'];

    if (sessionUUID != null && browserUUID != null) {
        await UserSession.destroy({
            where: {
                uuid: sessionUUID,
                browser_uuid: browserUUID
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
    const sessionToken = request.signedCookies[Config.SESSION_COOKIE_NAME];
    const browserUUID: string | string[] | undefined = request.headers['unique-browser-token'];
    const now = dayjs();

    // Check if token is present
    if (sessionToken == null || sessionToken == false || browserUUID == null) return null;

    // Get session from Database
    const session: UserSession | null = await UserSession.findOne({
        where: {
            uuid: sessionToken,
            browser_uuid: browserUUID
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
