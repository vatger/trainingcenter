import { NextFunction, Request, Response } from "express";
import { SysLog } from "../models/SysLog";
import UserSessionLibrary from "../libraries/session/UserSessionLibrary";

export async function syslogMiddleware(request: Request, response: Response, next: NextFunction) {
    if (request.url.includes("auth") || request.url.includes("syslog") || request.xhr) {
        // We don't want to log the auth logs. If we use the syslog, then that will also be logged, so lets remove this too.
        next();
        return;
    }

    const uid: number = await UserSessionLibrary.getUserIdFromSession(request);
    await SysLog.create({
        path: request.url,
        method: request.method,
        remote_addr: request.ip,
        user_id: uid === 0 ? null : uid.toString(),
    });

    next();
}
