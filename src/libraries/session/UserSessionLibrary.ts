import { Request } from "express";
import { Config } from "../../core/Config";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import SessionLibrary from "./SessionLibrary";
import { UserSession } from "../../models/UserSession";

async function getUserIdFromSession(request: Request): Promise<number> {
    const session_token = request.signedCookies[Config.SESSION_COOKIE_NAME];
    if (session_token == null || session_token == false) return 0;

    const sessionCurrent: UserSession | null = await SessionLibrary.validateSessionToken(request);
    if (sessionCurrent == null)
        return 0;

    return sessionCurrent.user_id;
}

async function getUserFromSession(request: Request): Promise<User | null> {
    const user_id: number = await getUserIdFromSession(request);
    if (user_id == 0) return null;

    return await User.findOne({
        where: {
            id: user_id,
        },
        include: {
            association: User.associations.roles,
            attributes: ["name"],
            through: {
                attributes: [],
            },
            include: [
                {
                    association: Role.associations.permissions,
                    attributes: ["name"],
                    through: {
                        attributes: [],
                    },
                },
            ],
        },
    });
}

export default {
    getUserFromSession,
    getUserIdFromSession,
}