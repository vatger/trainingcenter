import { Request, Response } from "express";
import { User } from "../../models/User";
import { handleUpload } from "../../libraries/upload/FileUploadLibrary";
import { FastTrackRequest } from "../../models/FastTrackRequest";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";

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
    create,
    getByUserID,
};
