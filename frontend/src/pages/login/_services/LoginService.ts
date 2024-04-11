import { axiosInstance } from "../../../utils/network/AxiosInstance";
import { useEffect, useState } from "react";
import { UserModel } from "../../../models/UserModel";
import { AxiosError, AxiosResponse } from "axios";
import { APIResponseError } from "./APIResponseError";
import dayjs from "dayjs";

const axiosAuthTimeout = 7000;

/**
 * Validates the session of the current user.
 * If 401 is returned, the user is unauthenticated
 */
async function validateSession(): Promise<UserModel> {
    const url = new URL(window.location.toString());
    if (url.searchParams.get("sinv") != null) throw Error;

    return axiosInstance
        .get(`/auth/data?date=${dayjs().unix()}`, {
            timeout: axiosAuthTimeout,
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
                Expires: "0",
            },
        })
        .then((res: AxiosResponse) => {
            if (res == null || res.data == null) throw Error;

            return res.data as UserModel;
        })
        .catch((err: AxiosError) => {
            throw err;
        });
}

/**
 * Gets the redirect uri from the backend
 * This is the URI that a user must be redirected to start the OAuth flow
 */
function getOAuthRedirectUri() {
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<APIResponseError>(undefined);
    const [redirectUri, setRedirectUri] = useState<string>("");

    useEffect(() => {
        axiosInstance
            .get("/auth/url")
            .then((res: AxiosResponse) => {
                setRedirectUri(res.data as string);
            })
            .catch((err: AxiosError) => {
                setLoadingError({
                    error: err,
                    custom: {
                        code: "ERR_API_OAUTH_REDIR_URL_LOAD",
                        message: "Failed to load VATSIM OAuth redirect URI",
                    },
                });
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        uri: redirectUri,
        loading,
        loadingError,
    };
}

/**
 * Handles the login request. If successful, returns the entire user model including personal data
 * @param remember
 */
async function handleLogin(remember: boolean): Promise<UserModel> {
    return axiosInstance
        .post("/auth/login", {
            connect_code: new URL(window.location.toString()).searchParams.get("code"),
            remember: remember,
        })
        .then((res: AxiosResponse) => {
            return res.data as UserModel;
        })
        .catch((err: AxiosError) => {
            throw err;
        });
}

export default {
    getOAuthRedirectUri,
    validateSession,
    handleLogin,
};
