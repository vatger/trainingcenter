import { AxiosRequestConfig } from "axios";
import { Config } from "./Config";
import { generateUUID } from "@/utils/helper/UUIDHelper";

// If the unique browser token isn't present, create one.
// This is used for the session creation
if (window.localStorage.getItem(Config.VATGER_BROWSER_TOKEN_NAME) == null) {
    window.localStorage.setItem(Config.VATGER_BROWSER_TOKEN_NAME, generateUUID());
}

export const AxiosConfiguration: AxiosRequestConfig = {
    baseURL: Config.API_BASE_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "unique-browser-token": window.localStorage.getItem(Config.VATGER_BROWSER_TOKEN_NAME),
    },
};
