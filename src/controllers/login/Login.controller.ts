import { Config } from "../../core/Config";
import { Request, Response } from "express";
import { ConnectOptions, VatsimConnectLibrary } from "../../libraries/vatsim/ConnectLibrary";
import { VatsimConnectException } from "../../exceptions/VatsimConnectException";
import Logger, { LogLevels } from "../../utility/Logger";
import { removeSessionToken } from "../../libraries/session/SessionLibrary";

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
function getRedirectUri() {
    const connectConfig = Config.CONNECT_CONFIG;

    return [
        connectConfig.BASE_URL,
        "/oauth/authorize",
        `?client_id=${connectConfig.CLIENT_ID}`,
        `&redirect_uri=${encodeURI(connectConfig.REDIRECT_URI ?? "")}`,
        "&response_type=code",
        `&scope=${connectConfig.SCOPE.split(" ").join("+")}`,
    ].join("");
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
        await vatsimConnectLibrary.login(response, code);
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

export default {
    getRedirectUri,
    login,
    logout,
};
