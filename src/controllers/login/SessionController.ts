import { User } from "../../models/User";
import { Request, Response } from "express";
import { UserSession } from "../../models/UserSession";
import { HttpStatusCode } from "axios";

async function getUserSessions(request: Request, response: Response) {
    const user: User = response.locals.user;

    const sessions = await UserSession.findAll({
        where: {
            user_id: user.id,
        },
        attributes: {
            exclude: ["uuid", "expires_at", "expires_latest"],
        },
    });

    response.send(sessions);
}

async function deleteUserSession(request: Request, response: Response) {
    const user: User = response.locals.user;
    const query = request.body as { session_id: number };

    await UserSession.destroy({
        where: {
            user_id: user.id,
            id: query.session_id,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

export default {
    getUserSessions,
    deleteUserSession,
};
