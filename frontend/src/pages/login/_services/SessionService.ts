import { useEffect, useState } from "react";
import { APIResponseError } from "@/pages/login/_services/APIResponseError";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { UserSessionModel } from "@/models/UserSessionModel";

function getUserSessions() {
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<APIResponseError>(undefined);
    const [userLoginSessions, setUserLoginSessions] = useState<UserSessionModel[]>([]);

    useEffect(() => {
        axiosInstance
            .get("/sessions")
            .then((res: AxiosResponse) => {
                setUserLoginSessions(res.data as UserSessionModel[]);
            })
            .catch((err: AxiosError) => {
                setLoadingError({
                    error: err,
                    custom: {
                        code: "ERR_API_USR_SESSION",
                        message: "Failed to load user sessions",
                    },
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        userLoginSessions,
        setUserLoginSessions,
        loading,
        loadingError,
    };
}

async function deleteSession(sessionID: number) {
    return axiosInstance.delete("/session", {
        data: {
            session_id: sessionID,
        },
    });
}

export default {
    getUserSessions,
    deleteSession,
};
