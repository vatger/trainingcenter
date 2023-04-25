import { NextFunction, Request, Response } from "express";
import { SysLog } from "../models/SysLog";
import SessionLibrary from "../libraries/session/SessionLibrary";

export async function syslogMiddleware(request: Request, response: Response, next: NextFunction) {
    const uid = await SessionLibrary.getUserIdFromSession(request);

    if (request.url.includes("code")) {
        next();
        return;
    }

    await SysLog.create({
        path: request.url,
        method: request.method,
        remote_addr: request.socket.remoteAddress,
        user_id: uid == 0 ? undefined : uid.toString(),
    });

    next();
}
