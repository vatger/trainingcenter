import { Config } from "../../core/Config";
import { Request, Response } from "express";
import { ConnectOptions, VatsimConnectLibrary } from "../../libraries/vatsim/ConnectLibrary";
import { VatsimConnectException } from "../../exceptions/VatsimConnectException";
import Logger, { LogLevels } from "../../utility/Logger";
import SessionLibrary, { removeSessionToken } from "../../libraries/session/SessionLibrary";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import UserSessionLibrary from "../../libraries/session/UserSessionLibrary";

// We can ignore all errors, since we are validating the .env
const connect_options: ConnectOptions = {
    // @ts-ignore
    client_id: Config.CONNECT_CONFIG.CLIENT_ID,
    // @ts-ignore
    client_secret: Config.CONNECT_CONFIG.SECRET,
    // @ts-ignore
    redirect_uri: encodeURI(Config.CONNECT_CONFIG.REDIRECT_URI),
    // @ts-ignore
    base_uri: Config.CONNECT_CONFIG.BASE_URL,
    // @ts-ignore
    client_scopes: Config.CONNECT_CONFIG.SCOPE,
};

/**
 * Returns the redirect URI for VATSIM Connect
 */
function getRedirectUri(request: Request, response: Response) {
    const connectConfig = Config.CONNECT_CONFIG;

    response.send(
        [
            connectConfig.BASE_URL,
            "/oauth/authorize",
            `?client_id=${connectConfig.CLIENT_ID}`,
            `&redirect_uri=${encodeURI(connectConfig.REDIRECT_URI ?? "")}`,
            "&response_type=code",
            `&scope=${connectConfig.SCOPE.split(" ").join("+")}`,
        ].join("")
    );
}

/**
 * Signs the user in and returns the user model if successful including personal data
 * @param request
 * @param response
 */
async function login(request: Request, response: Response) {
    const code = request.body.connect_code;
    const remember: boolean = request.body.remember ?? false;
    const vatsimConnectLibrary = new VatsimConnectLibrary(connect_options, remember);

    try {
        await vatsimConnectLibrary.login(request, response, code);
    } catch (e: any) {
        if (e instanceof VatsimConnectException) {
            Logger.log(LogLevels.LOG_ERROR, e.message);
            e.sendResponse(response);
            return;
        }
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

async function validateSessionToken(request: Request, response: Response) {
    response.send((await SessionLibrary.validateSessionToken(request)) != null);
}

export default {
    getRedirectUri,
    login,
    logout,
    getUserData,
    validateSessionToken,
};
