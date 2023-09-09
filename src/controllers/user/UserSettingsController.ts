import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { UserSettings } from "../../models/UserSettings";
import { HttpStatusCode } from "axios";

async function updateSettings(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const body = request.body as { language: "de" | "en" };

        await UserSettings.update(
            {
                language: body.language,
            },
            {
                where: {
                    user_id: user.id,
                },
            }
        );

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default { updateSettings };
