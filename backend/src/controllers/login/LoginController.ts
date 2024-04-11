import { Config } from "../../core/Config";
import { NextFunction, Request, Response } from "express";
import { ConnectOptions, VatsimConnectLibrary } from "../../libraries/vatsim/ConnectLibrary";
import SessionLibrary, { removeSessionToken } from "../../libraries/session/SessionLibrary";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import UserSessionLibrary from "../../libraries/session/UserSessionLibrary";
import dayjs from "dayjs";
import { HttpStatusCode } from "axios";

// We can ignore all errors, since we are validating the .env at startup
const connect_options: ConnectOptions = {
    client_id: Config.CONNECT_CONFIG.CLIENT_ID!,
    client_secret: Config.CONNECT_CONFIG.SECRET!,
    redirect_uri: encodeURI(Config.CONNECT_CONFIG.REDIRECT_URI!),
    base_uri: Config.CONNECT_CONFIG.BASE_URL!,
    client_scopes: Config.CONNECT_CONFIG.SCOPE!,
};

/**
 * Returns the redirect URI for VATSIM Connect
 */
function getRedirectUri(request: Request, response: Response) {
    const connectConfig = Config.CONNECT_CONFIG;

    const uri = [
        connectConfig.BASE_URL,
        "/oauth/authorize",
        `?client_id=${connectConfig.CLIENT_ID}`,
        `&redirect_uri=${encodeURI(connectConfig.REDIRECT_URI ?? "")}`,
        "&response_type=code",
        `&scope=${encodeURI(connectConfig.SCOPE.split(",").join(" "))}`,
    ].join("")

    response.send(uri);
}

/**
 * Signs the user in and returns the user model if successful including personal data
 * @param request
 * @param response
 * @param next
 */
async function login(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { connect_code: string; remember?: boolean };
        const vatsimConnectLibrary = new VatsimConnectLibrary(connect_options, body.remember ?? false);

        await vatsimConnectLibrary.login(request, response, body.connect_code);
    } catch (e) {
        next(e);
    }
}

/**
 * Logs the user out and removes the session
 * @param request
 * @param response
 */
async function logout(request: Request, response: Response) {
    await removeSessionToken(request, response);
    response.send({ success: true, message: "Signed out" });
}

async function getUserData(request: Request, response: Response) {
    if ((await SessionLibrary.validateSessionToken(request)) == null) {
        response.status(401).send({ message: "Session token invalid" });
        return;
    }

    const user_id: number = await UserSessionLibrary.getUserIdFromSession(request);

    const user: User | null = await User.scope("sensitive").findOne({
        where: {
            id: user_id,
        },
        include: [
            {
                association: User.associations.user_data,
            },
            {
                association: User.associations.user_settings,
            },
            {
                association: User.associations.roles,
                attributes: ["name"],
                through: { attributes: [] },

                include: [
                    {
                        association: Role.associations.permissions,
                        attributes: ["name"],
                        through: { attributes: [] },
                    },
                ],
            },
        ],
    });

    response.send(user);
}

async function updateUserData(request: Request, response: Response) {
    const user: User = response.locals.user;
    if (dayjs.utc().diff(user.updatedAt, "minutes") < 30) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    let vatsimConnectLibrary = new VatsimConnectLibrary(connect_options);
    await vatsimConnectLibrary.updateUserData(request, response);
}

async function validateSessionToken(request: Request, response: Response) {
    response.send((await SessionLibrary.validateSessionToken(request)) != null);
}

export default {
    getRedirectUri,
    login,
    logout,
    getUserData,
    validateSessionToken,
    updateUserData,
};
