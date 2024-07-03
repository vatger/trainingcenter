import axios, { Axios, AxiosResponse, HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { VatsimOauthToken, VatsimScopes, VatsimUserData } from "./ConnectTypes";
import { ConnectLibraryErrors, VatsimConnectException } from "../../exceptions/VatsimConnectException";
import { checkIsUserBanned } from "../../utility/helper/MembershipHelper";
import { UserSession } from "../../models/UserSession";
import { createSessionToken } from "../session/SessionLibrary";
import { UserData } from "../../models/UserData";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { UserSettings } from "../../models/UserSettings";
import { Config } from "../../core/Config";
import { sequelize } from "../../core/Sequelize";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

export type ConnectOptions = {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    base_uri?: string;
    client_scopes: string;
};

export class VatsimConnectLibrary {
    private readonly m_axiosInstance: Axios;

    private readonly m_connectOptions: ConnectOptions | undefined = undefined;
    private readonly m_remember: boolean;

    private m_accessToken: string | undefined = undefined;
    private m_refreshToken: string | undefined = undefined;
    private m_suppliedScopes: VatsimScopes | undefined = undefined;

    private m_userData: VatsimUserData | undefined = undefined;
    private m_response: Response | undefined = undefined;
    private m_request: Request | undefined = undefined;

    constructor(connectOptions?: ConnectOptions, remember?: boolean) {
        this.m_connectOptions = connectOptions;
        this.m_remember = remember ?? false;

        if (connectOptions == null) throw new VatsimConnectException();

        this.m_axiosInstance = axios.create({
            baseURL: this.m_connectOptions?.base_uri ?? Config.CONNECT_CONFIG.BASE_URL,
            timeout: 5000,
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
        });
    }

    /**
     * Handle the login flow
     * @throws VatsimConnectException
     */
    public async login(request: Request, response: Response, code: string | undefined) {
        if (code == null) throw new VatsimConnectException(ConnectLibraryErrors.ERR_NO_CODE);

        this.m_response = response;
        this.m_request = request;

        await this._queryAccessTokens(code);
        await this._queryUserData();

        if (this.m_userData == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        this._validateSuppliedScopes();
        await this._checkIsUserSuspended();
        await this._checkIsUserAllowed();

        if (this.m_userData == null) throw new VatsimConnectException();

        // Create database entries
        await this._updateDatabase();

        await UserSettings.findOrCreate({
            where: {
                user_id: this.m_userData.data.cid,
            },
            defaults: {
                user_id: this.m_userData.data.cid,
                language: "de",
                additional_emails: [],
                email_notifications_enabled: true,
            },
        });

        const user: User | null = await User.scope("sensitive").findOne({
            where: {
                id: this.m_userData?.data.cid,
            },
            include: [
                {
                    association: User.associations.user_data,
                    as: "user_data",
                },
                {
                    association: User.associations.user_settings,
                    as: "user_settings",
                },
                {
                    association: User.associations.roles,
                    as: "roles",
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

        const session = await this._handleSessionChange();
        if (session) {
            response.send(user);
            return;
        }

        throw new VatsimConnectException(ConnectLibraryErrors.ERR_UNABLE_CREATE_SESSION);
    }

    /**
     * Updates the user data of the requesting user
     * Queries the VATSIM API (if the access token is valid)
     * If not, don't bother refreshing, send the user to the login page - it's easier ;)
     * @param request
     * @param response
     */
    public async updateUserData(request: Request, response: Response) {
        const user: User = response.locals.user;

        const userWithAccessToken = await User.scope("internal").findOne({
            where: {
                id: user.id,
            },
        });

        if (userWithAccessToken == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        this.m_accessToken = userWithAccessToken.access_token ?? undefined;
        this.m_refreshToken = userWithAccessToken.refresh_token ?? undefined;

        const newUserData = await this._queryUserData();
        if (newUserData == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        // Create database entries
        await this._updateDatabase();

        const newUser = await User.scope("sensitive").findOne({
            where: {
                id: this.m_userData?.data.cid,
            },
            include: [
                {
                    association: User.associations.user_data,
                    as: "user_data",
                },
                {
                    association: User.associations.user_settings,
                    as: "user_settings",
                },
                {
                    association: User.associations.roles,
                    as: "roles",
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

        if (newUser == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        response.send(newUser);
    }

    /**
     * Query the VATSIM oauth/token endpoint to receive the access and refresh tokens
     * @param vatsim_code
     * @private
     */
    private async _queryAccessTokens(vatsim_code: string) {
        // Query access token
        let auth_response: AxiosResponse = {} as AxiosResponse;

        try {
            auth_response = await this.m_axiosInstance.post("/oauth/token", {
                code: vatsim_code,
                grant_type: "authorization_code",
                client_id: this.m_connectOptions?.client_id,
                client_secret: this.m_connectOptions?.client_secret,
                redirect_uri: this.m_connectOptions?.redirect_uri,
            });
        } catch (e: any) {
            console.log(e);
            if (e.response.data.hint.toLowerCase().includes("revoked")) {
                throw new VatsimConnectException(ConnectLibraryErrors.ERR_INV_CODE);
            }
        }

        const auth_response_data: VatsimOauthToken | undefined = auth_response.data as VatsimOauthToken;

        if (auth_response_data == null) {
            throw new VatsimConnectException(ConnectLibraryErrors.ERR_INV_SCOPES);
        }

        this.m_accessToken = auth_response_data.access_token;
        this.m_refreshToken = auth_response_data.refresh_token;
        this.m_suppliedScopes = auth_response_data.scopes as VatsimScopes;
    }

    /**
     * Query the VATSIM api/user endpoint to receive the actual user data
     * @private
     */
    private async _queryUserData() {
        if (this.m_accessToken == null) return null;

        let user_response: AxiosResponse | undefined = undefined;

        try {
            user_response = await this.m_axiosInstance.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${this.m_accessToken}`,
                    Accept: "application/json",
                },
            });
        } catch (e) {}

        const user_response_data: VatsimUserData | undefined = user_response?.data as VatsimUserData;

        this.m_userData = user_response_data;
        return user_response_data;
    }

    /**
     * Validates whether the supplied scopes are sufficient
     * @private
     * @throws VatsimConnectException - If the supplied scopes are not valid, throws an exception
     */
    private _validateSuppliedScopes() {
        if (this.m_suppliedScopes == null) throw new VatsimConnectException();

        const required_scopes = this.m_connectOptions?.client_scopes.split(",") as VatsimScopes;
        for (let i = 0; i < required_scopes.length; i++) {
            if (this.m_suppliedScopes.indexOf(required_scopes[i]) === -1) {
                throw new VatsimConnectException(ConnectLibraryErrors.ERR_INV_SCOPES);
            }
        }
    }

    /**
     * Checks if the given user trying to log in has been suspended from the system
     * @private
     * @throws VatsimConnectException - If the user is suspended, throws exception
     */
    private async _checkIsUserSuspended() {
        if (this.m_userData == undefined) return null;

        const suspension_status = await checkIsUserBanned(this.m_userData.data.cid);
        if (suspension_status || this.m_userData.data.vatsim.rating.id === 0) {
            throw new VatsimConnectException(ConnectLibraryErrors.ERR_SUSPENDED);
        }
    }

    /**
     *
     * @private
     * @throws VatsimConnectException - If the user is not allowed, throws exception
     */
    private async _checkIsUserAllowed() {
        if (this.m_userData == undefined) return null;
        const allowed_cids = [
            1373921, 1119615, 1450775, 1331358, 1357290, 1439797, 1583954, 1438611, 1432304, 1439600, 1463320, 1238939, 10000010, 10000001, 1117638, 1132984,
            1238939, 1272780, 1316527, 1336219, 1357290, 1407054, 1432304, 1439600, 1439797, 1443079, 1447366, 1451860, 1454201, 1463320, 1467762, 1467870,
            1487136, 1506680, 1507672, 1520064, 1524005, 1569331, 1583954, 1593864, 1626019, 1627359, 1649341, 1667561, 1692470, 944693, 1083033, 1196986,
            1238939, 1272780, 1316527, 1336219, 1345921, 1378351, 1404385, 1433041, 1434698, 1438611, 1439600, 1439797, 1447366, 1454201, 1457329, 1467740,
            1467870, 1468997, 1477025, 1477582, 1482057, 1482456, 1488616, 1495699, 1527122, 1528134, 1542149, 1543292, 1583954, 1591329, 1610484, 1625839,
            1627359, 1657818, 1044887, 1077986, 1279468, 1342244, 1357290, 1381951, 1395737, 1413802, 1451860, 1456550, 1459636, 1463320, 1465242, 1466083,
            1468202, 1476945, 1487136, 1491867, 1501396, 1504305, 1512446, 1520064, 1524005, 1556813, 1558853, 1611428, 1612478, 874505, 1378091, 1432304,
            1441619, 1470223, 1519114, 1519639, 1586741, 1593864, 1626019, 1532450,
        ];

        if (!allowed_cids.includes(Number(this.m_userData.data.cid))) {
            throw new VatsimConnectException(ConnectLibraryErrors.ERR_SUSPENDED);
        }
    }

    private async _handleSessionChange() {
        const browserUUID: string | string[] | undefined = this.m_request?.headers["unique-browser-token"];

        if (this.m_response == null || this.m_request == null || browserUUID == null || this.m_userData?.data.cid == null) throw new VatsimConnectException();

        // Remove old session
        await UserSession.destroy({
            where: {
                user_id: this.m_userData.data.cid,
                browser_uuid: browserUUID,
            },
        });

        // Create new session
        return await createSessionToken(this.m_request, this.m_response, this.m_userData?.data.cid, this.m_remember);
    }

    /**
     * Check the validity of the user data returned by VATSIM
     * Returns true, if the structure is valid
     * @private
     */
    private _validateUserData() {
        return Validator.validateAndReturn(this.m_userData?.data, {
            cid: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            personal: [ValidationTypeEnum.NON_NULL],
            vatsim: [ValidationTypeEnum.NON_NULL],
        });
    }

    private async _updateDatabase() {
        if (this.m_userData == null || !this._validateUserData()) throw new VatsimConnectException(ConnectLibraryErrors.ERR_VALIDATION);

        const tokenValid = this.m_userData.data.oauth.token_valid?.toLowerCase() === "true";
        const t = await sequelize.transaction();

        try {
            // Create database entries
            await User.upsert(
                {
                    id: this.m_userData.data.cid,
                    first_name: this.m_userData.data.personal.name_first,
                    last_name: this.m_userData.data.personal.name_last,
                    email: this.m_userData.data.personal.email,
                    access_token: tokenValid ? this.m_accessToken : null,
                    refresh_token: tokenValid ? this.m_refreshToken : null,
                },
                {
                    transaction: t,
                }
            );

            await UserData.upsert(
                {
                    user_id: this.m_userData.data.cid,
                    rating_atc: this.m_userData.data.vatsim.rating.id,
                    rating_pilot: this.m_userData.data.vatsim.pilotrating.id,
                    country_code: this.m_userData.data.personal.country.id,
                    country_name: this.m_userData.data.personal.country.name,
                    region_name: this.m_userData.data.vatsim.region.name,
                    region_code: this.m_userData.data.vatsim.region.id,
                    division_name: this.m_userData.data.vatsim.division.name,
                    division_code: this.m_userData.data.vatsim.division.id,
                    subdivision_name: this.m_userData.data.vatsim.subdivision.name,
                    subdivision_code: this.m_userData.data.vatsim.subdivision.id,
                },
                {
                    transaction: t,
                }
            );

            await t.commit();
        } catch (e) {
            await t.rollback();
        }
    }
}
