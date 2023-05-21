import { NextFunction, Request, Response } from "express";
import { SysLog } from "../models/SysLog";
import UserSessionLibrary from "../libraries/session/UserSessionLibrary";

export async function syslogMiddleware(request: Request, response: Response, next: NextFunction) {
    if (request.url.includes("auth") || request.xhr) {
        next();
        return;
    }

    const uid: number = await UserSessionLibrary.getUserIdFromSession(request);
    await SysLog.create({
        path: request.url,
        method: request.method,
        remote_addr: request.socket.remoteAddress,
        user_id: uid === 0 ? null : uid.toString(),
    });

    next();
}
