import { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "../exceptions/ForbiddenException";
import { HttpStatusCode } from "axios";
import { ValidationException } from "../exceptions/ValidationException";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { VatsimConnectException } from "../exceptions/VatsimConnectException";

export async function exceptionInterceptorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    if (error instanceof UnauthorizedException) {
        response.status(HttpStatusCode.Unauthorized).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.Unauthorized,
            message: error.message,
        });
        return;
    }

    if (error instanceof ForbiddenException) {
        response.status(HttpStatusCode.Forbidden).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.Forbidden,
            message: error.message,
        });
        return;
    }

    if (error instanceof ValidationException) {
        response.status(HttpStatusCode.BadRequest).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.BadRequest,
            message: error.message,
            validation: error.getErrorMessages(),
        });
        return;
    }

    if (error instanceof VatsimConnectException) {
        error.sendResponse(response);
        return;
    }

    if (error.name === "SequelizeValidationError") {
        response.status(HttpStatusCode.InternalServerError).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.InternalServerError,
            message: "An error occurred trying to validate your data. Check all fields are present and correctly formatted (if applicable)",
        });
        return;
    }

    console.error(error);
    response.status(HttpStatusCode.InternalServerError).send({
        path: request.url,
        method: request.method,
        code: HttpStatusCode.InternalServerError,
        message: "An unknown error occurred. Please try again later or contact and administrator if you believe this is in error.",
    });
}
