import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import UserSessionLibrary from "../libraries/session/UserSessionLibrary";

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const user: User | null = await UserSessionLibrary.getUserFromSession(request);

    if (user == null) {
        response.status(401).send({
            success: false,
            code: "ERR_AUTH",
            message: "Unauthenticated",
        });
        return;
    }

    request.body.user = user;
    next();
}
