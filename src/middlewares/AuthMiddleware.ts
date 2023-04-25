import { NextFunction, Request, Response } from "express";
import SessionLibrary from "../libraries/session/SessionLibrary";
import { User } from "../models/User";

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const user: User | null = await SessionLibrary.getUserFromSession(request);

    if (user == null) {
        response.status(401).send({ message: "Unauthenticated", status: "ERR_AUTH" });
        return;
    }

    request.body.user = user;
    next();
}
