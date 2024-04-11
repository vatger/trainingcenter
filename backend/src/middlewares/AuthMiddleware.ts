import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import UserSessionLibrary from "../libraries/session/UserSessionLibrary";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const user: User | null = await UserSessionLibrary.getUserFromSession(request);

    if (user == null) {
        const exception = new UnauthorizedException("The current session is invalid. Log in again to refresh the session.");
        next(exception);
        return;
    }

    response.locals.user = user;
    next();
}
