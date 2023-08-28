import { Request, Response } from "express";
import { User } from "../../models/User";
import { UserSettings } from "../../models/UserSettings";
import { HttpStatusCode } from "axios";

async function updateSettings(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { dark_mode: boolean; language: "de" | "en" };

    await UserSettings.update(
        {
            dark_mode: body.dark_mode,
            language: body.language,
        },
        {
            where: {
                user_id: user.id,
            },
        }
    );

    response.sendStatus(HttpStatusCode.Ok);
}

export default { updateSettings };
