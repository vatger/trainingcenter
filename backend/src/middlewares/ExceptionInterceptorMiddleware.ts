import { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "../exceptions/ForbiddenException";
import { HttpStatusCode } from "axios";
import { ValidationException } from "../exceptions/ValidationException";
import { UnauthorizedException } from "../exceptions/UnauthorizedException";
import { VatsimConnectException } from "../exceptions/VatsimConnectException";
import { MissingPermissionException } from "../exceptions/MissingPermissionException";
import { SysLog } from "../models/SysLog";
import { User } from "../models/User";

const sequelizeErrors = ["SequelizeValidationError", "SequelizeForeignKeyConstraintError", "SequelizeUniqueConstraintError"];

export async function exceptionInterceptorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    console.error(error);

    if (error instanceof UnauthorizedException) {
        response.status(HttpStatusCode.Unauthorized).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.Unauthorized,
            message: error.message,
        });
        return;
    }

    if (error instanceof MissingPermissionException) {
        response.status(HttpStatusCode.Forbidden).send({
            path: request.path,
            method: request.method,
            message: "Missing required permission",
            permission: error.getMissingPermission(),
            stay: error.getPageStayAttribute(),
        });

        const user: User = response.locals.user;
        await SysLog.create({
            path: request.path,
            method: request.method,
            user_id: user?.id.toString(),
            remote_addr: request.ip,
            message: `User ${user.id} attempted to access ${
                request.path
            } without required permission. The missing permission was: ${error.getMissingPermission()}. Server responded with forbidden status.`,
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
            message: "Validation checks have failed",
            validation: error.getErrorMessages(),
        });
        return;
    }

    if (error instanceof VatsimConnectException) {
        error.sendResponse(response);
        return;
    }

    if (sequelizeErrors.includes(error.name)) {
        response.status(HttpStatusCode.InternalServerError).send({
            path: request.url,
            method: request.method,
            code: HttpStatusCode.InternalServerError,
            message: "An error occurred trying to validate your data. Check all fields are present and correctly formatted (if applicable)",
        });
        return;
    }

    response.status(HttpStatusCode.InternalServerError).send({
        path: request.url,
        method: request.method,
        code: HttpStatusCode.InternalServerError,
        message: "An unknown error occurred. Please try again later or contact and administrator if you believe this is in error.",
    });
}
