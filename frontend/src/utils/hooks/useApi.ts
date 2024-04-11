import { Dispatch, useEffect, useRef, useState } from "react";
import { AxiosError, AxiosResponse, Method, ResponseType } from "axios";
import { axiosInstance } from "@/utils/network/AxiosInstance";

interface IUseApi<T> {
    url: string;
    method: Method;
    params?: any;
    data?: any;
    responseType?: ResponseType;

    onLoad?: (value: T) => any;
    onError?: (err: AxiosError) => any;
}

interface IUseApiReturn<T> {
    loading: boolean;
    loadingError: AxiosError | undefined;
    data: T | undefined;
    setData: Dispatch<T | undefined>;
}

/**
 * Makes an API Request to the specified url and returns the result of that query cast to the type of T
 * Note: This can only be used inside a React component due to the use of useEffect
 * @param props
 */
function useApi<T>(props: IUseApi<T>): IUseApiReturn<T> {
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingError, setLoadingError] = useState<AxiosError | undefined>(undefined);
    const [responseData, setResponseData] = useState<T | undefined>(undefined);

    useEffect(() => {
        const controller = new AbortController();

        if (props.url.includes("undefined")) {
            setLoading(false);
            return;
        }

        axiosInstance({
            method: props.method,
            params: props.params,
            data: props.data,
            url: props.url,
            responseType: props.responseType ?? "json",
            signal: controller.signal,
        })
            .then((res: AxiosResponse) => {
                const response: T = res.data as T;

                setResponseData(response);
                props.onLoad?.(response);
            })
            .catch((err: AxiosError) => {
                if (controller.signal.aborted) {
                    return;
                }

                setLoadingError(err);
                props.onError?.(err);
            })
            .finally(() => {
                if (controller.signal.aborted) {
                    return;
                }

                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, []);

    return {
        loading: loading,
        loadingError: loadingError,
        data: responseData,
        setData: setResponseData,
    };
}

export default useApi;
