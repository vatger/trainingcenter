import { AxiosError } from "axios";

export type APIResponseError = ResponseError | undefined;

interface ResponseError {
    error: AxiosError;
    custom?: APICustomError;
}

interface APICustomError {
    code?: string;
    status?: number;
    message?: string;
}
