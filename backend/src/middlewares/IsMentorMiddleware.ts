import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ForbiddenException } from "../exceptions/ForbiddenException";

export async function isMentorMiddleware(_request: Request, response: Response, next: NextFunction) {
    const user: User = response.locals.user;

    if (!(await user.isMentor())) {
        const exception = new ForbiddenException("You are not a mentor!");
        next(exception);
        return;
    }

    next();
}
