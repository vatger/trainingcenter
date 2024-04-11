import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { handleUpload } from "../../libraries/upload/FileUploadLibrary";
import { FastTrackRequest } from "../../models/FastTrackRequest";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Op } from "sequelize";
import { HttpStatusCode } from "axios";
import { Config } from "../../core/Config";
import path from "path";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

/**
 * Returns the fast track including target user and requesting user
 * @param id
 */
async function _getFastTrackByID(id: any) {
    return await FastTrackRequest.findOne({
        where: {
            id: id,
        },
        include: [FastTrackRequest.associations.user, FastTrackRequest.associations.requested_by_user],
    });
}

/**
 * Returns a list of all fast track requests
 * @param request
 * @param response
 * @param next
 */
async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "atd.fast_track.view", true);

        const fastTracks = await FastTrackRequest.findAll({
            include: [FastTrackRequest.associations.user],
        });

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
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "atd.fast_track.view", false);

        const pendingFastTracks = await FastTrackRequest.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.not]: {
                            status: 4,
                        },
                    },
                    {
                        [Op.not]: {
                            status: 5,
                        },
                    },
                ],
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
    const reqUser: User = response.locals.user;
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
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        PermissionHelper.checkUserHasPermission(user, "atd.fast_track.view", false);

        const pendingFastTracks = await _getFastTrackByID(params.id);

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
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        PermissionHelper.checkUserHasPermission(user, "atd.fast_track.view", false);

        const pendingFastTracks = await _getFastTrackByID(params.id);

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
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const body = request.body as { comment?: string; status: number };
        PermissionHelper.checkUserHasPermission(user, "atd.fast_track.view", true);

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
    const query: { user_id: number } = request.query as any;

    Validator.validate(query, {
        user_id: [ValidationTypeEnum.NON_NULL],
    });

    const fastTrackRequests = await FastTrackRequest.findAll({
        where: {
            user_id: query.user_id,
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
