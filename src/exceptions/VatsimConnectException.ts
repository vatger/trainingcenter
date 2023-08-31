import { Response } from "express";

export enum ConnectLibraryErrors {
    ERR_NO_CODE,
    ERR_SUSPENDED,
    ERR_INV_SCOPES,
    ERR_UNABLE_CREATE_SESSION,
    ERR_AUTH_REVOKED,
    ERR_INV_CODE,
    ERR_NO_AUTH_RESPONSE,
    ERR_AXIOS_TIMEOUT,
}

export class VatsimConnectException extends Error {
    private readonly error_: ConnectLibraryErrors | undefined = undefined;

    constructor(error?: ConnectLibraryErrors) {
        super();
        this.error_ = error;
    }

    public sendResponse(response: Response) {
        switch (this.error_) {
            case ConnectLibraryErrors.ERR_NO_CODE:
                response.status(404).send({ code: "ERR_NO_CODE", message: "No code was supplied" });
                return;

            case ConnectLibraryErrors.ERR_SUSPENDED:
                response.status(403).send({ code: "ERR_SUSP", message: "Account suspended", hint: "Nevermind, bin gebannt" });
                return;

            case ConnectLibraryErrors.ERR_INV_SCOPES:
                response.status(500).send({ code: "ERR_INV_SCOPES", message: "Invalid scopes supplied" });
                return;

            case ConnectLibraryErrors.ERR_INV_CODE:
                response.status(500).send({ code: "CODE_EXP", message: "Authorization Code expired" });
                return;

            case ConnectLibraryErrors.ERR_UNABLE_CREATE_SESSION:
                response.status(500).send({ code: "ERR_SESS", message: "Unable to create session" });
                return;

            case ConnectLibraryErrors.ERR_AUTH_REVOKED:
                response.status(500).send({ code: "ERR_AUTH_REVOKED", message: "Authorization token has been revoked" });
                return;

            case ConnectLibraryErrors.ERR_NO_AUTH_RESPONSE:
                response.status(500).send({ code: "ERR_NO_AUTH_RESPONSE", message: "No response from VATSIM auth server" });
                return;

            default:
                response.status(500).send({ code: "ERR", message: "An unknown error occurred" });
        }
    }
}
