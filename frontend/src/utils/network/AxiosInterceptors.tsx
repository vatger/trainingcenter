import { axiosInstance } from "./AxiosInstance";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AxiosResponse } from "axios";
import { ConversionUtils } from "turbocommons-ts";
import { store } from "@/app/store";
import { signOut } from "@/app/features/authSlice";

export function AxiosInterceptors() {
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        const responseHandler = (config: AxiosResponse) => {
            return config;
        };

        const responseErrorInterceptor = (error: any) => {
            if (error.response != null && error.response.status == 401) {
                if (window.location.href.toLowerCase().includes("login")) return;
                store.dispatch(signOut());
                navigate("/login?sinv");
            }

            if (error.response != null && error.response.status == 403) {
                const stay = error.response?.data?.stay ?? false;

                if (error.response?.data?.permission == null) navigate(`/403${stay ? "?s=true" : ""}`);
                else navigate(`/403?m=${ConversionUtils.stringToBase64(error.response.data.permission)}${stay ? "&s=true" : ""}`);
            }
            return Promise.reject(error);
        };

        const responseInterceptor: number = axiosInstance.interceptors.response.use(responseHandler, responseErrorInterceptor);

        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate]);

    return <></>;
}
