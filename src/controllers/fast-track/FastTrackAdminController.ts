import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { handleUpload } from "../../libraries/upload/FileUploadLibrary";
import { FastTrackRequest } from "../../models/FastTrackRequest";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Op } from "sequelize";
import { HttpStatusCode } from "axios";
import fileUpload from "express-fileupload";
import { Config } from "../../core/Config";
import path from "path";

/**
 * Returns a list of all fast track requests
 * @param request
 * @param response
 * @param next
 */
async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        if (!PermissionHelper.checkUserHasPermission(user, response, "atd.fast-track.all.view", true)) return;

        const fastTracks = await FastTrackRequest.findAll();

        response.send(fastTracks);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of all pending fast track requests
 * @param request
 * @param response
 * @param next
 */
async function getAllPending(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        if (!PermissionHelper.checkUserHasPermission(user, response, "atd.fast-track.pending.view", true)) return;

        const pendingFastTracks = await FastTrackRequest.findAll({
            where: {
                [Op.or]: {
                    [Op.not]: {
                        status: 4,
                    },
                    [Op.not]: {
                        status: 5,
                    },
                },
            },
            include: [FastTrackRequest.associations.user],
        });

        response.send(pendingFastTracks);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates a new fast track request
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const data = request.body;
    const file_name = handleUpload(request);

    if (file_name == null) {
        response.status(500).send({ message: "Failed to create fast-track request" });
        return;
    }

    const model = await FastTrackRequest.create({
        user_id: Number(data.user_id ?? "-1"),
        requested_by_user_id: reqUser.id,
        status: 0,
        rating: Number(data.rating ?? "-1"),
        file_name: file_name?.[0],
        comment: data.description,
    });

    response.send(model);
}

/**
 * Returns fast track request by ID
 * @param request
 * @param response
 * @param next
 */
async function getAttachmentByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const params = request.params as { id: string };
        if (!PermissionHelper.checkUserHasPermission(user, response, "atd.fast-track.pending.view", true)) return;

        const pendingFastTracks = await FastTrackRequest.findOne({
            where: {
                id: params.id,
            },
            include: [FastTrackRequest.associations.user, FastTrackRequest.associations.requested_by_user],
        });

        if (pendingFastTracks == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const filePath = path.join(process.cwd(), Config.FILE_STORAGE_LOCATION, pendingFastTracks.file_name ?? "");
        response.sendFile(filePath);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns fast track request by ID
 * @param request
 * @param response
 * @param next
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const params = request.params as { id: string };
        if (!PermissionHelper.checkUserHasPermission(user, response, "atd.fast-track.pending.view", true)) return;

        const pendingFastTracks = await FastTrackRequest.findOne({
            where: {
                id: params.id,
            },
            include: [FastTrackRequest.associations.user, FastTrackRequest.associations.requested_by_user],
        });

        if (pendingFastTracks == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(pendingFastTracks);
    } catch (e) {
        next(e);
    }
}

/**
 * Updates a fast track request
 * @param request
 * @param response
 * @param next
 */
async function updateByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const params = request.params as { id: string };
        const body = request.body as { comment?: string; status: number };
        if (!PermissionHelper.checkUserHasPermission(user, response, "atd.fast-track.update", true)) return;

        if (body.status == null || params.id == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        if (body.comment) {
            await FastTrackRequest.update(
                {
                    response: body.comment,
                    status: body.status,
                },
                {
                    where: {
                        id: params.id,
                    },
                }
            );
        } else {
            await FastTrackRequest.update(
                {
                    status: body.status,
                },
                {
                    where: {
                        id: params.id,
                    },
                }
            );
        }

        const fastTrack = await FastTrackRequest.findByPk(params.id, {
            include: [FastTrackRequest.associations.user, FastTrackRequest.associations.requested_by_user],
        });

        if (fastTrack == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(fastTrack);
    } catch (e) {
        next(e);
    }
}

/**
 * Get all fast track requests by User ID
 * @param request
 * @param response
 */
async function getByUserID(request: Request, response: Response) {
    const requestData: { user_id: number } = request.query as any;

    const validation = ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: requestData.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const fastTrackRequests = await FastTrackRequest.findAll({
        where: {
            user_id: requestData.user_id,
        },
    });

    response.send(fastTrackRequests);
}

export default {
    getAll,
    getAllPending,
    getAttachmentByID,
    getByID,
    updateByID,
    create,
    getByUserID,
};
