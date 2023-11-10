import { NextFunction, Request, Response } from "express";
import _SoloAdminValidator from "./_SoloAdmin.validator";
import { UserSolo } from "../../models/UserSolo";
import dayjs from "dayjs";
import { HttpStatusCode } from "axios";
import { User } from "../../models/User";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";

type CreateSoloRequestBody = {
    solo_duration: string;
    solo_start: string;
    trainee_id: number;
    endorsement_group_id: string;
};

type UpdateSoloRequestBody = Omit<CreateSoloRequestBody, "endorsement_group_id">;

async function createSolo(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const body = request.body as CreateSoloRequestBody;
        _SoloAdminValidator.validateCreateRequest(body);

        const startDate = dayjs.utc(body.solo_start);
        const endDate = startDate.add(Number(body.solo_duration), "days");

        const solo = await UserSolo.create({
            user_id: body.trainee_id,
            created_by: user.id,
            // @ts-ignore | We checked whether the string is contained in the array of ratings, so all fine.
            solo_rating: body.solo_rating,
            solo_used: Number(body.solo_duration),
            extension_count: 0,
            current_solo_start: startDate.toDate(),
            current_solo_end: endDate.toDate(),
        });

        await EndorsementGroupsBelongsToUsers.create({
            user_id: body.trainee_id,
            endorsement_group_id: Number(body.endorsement_group_id),
            solo_id: solo.id,
        });

        const returnUser = await User.findOne({
            where: {
                id: body.trainee_id,
            },
            include: [User.associations.user_solo, User.associations.endorsement_groups],
        });

        response.status(HttpStatusCode.Created).send(returnUser);
    } catch (e) {
        next(e);
    }
}

async function updateSolo(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const body = request.body as UpdateSoloRequestBody;
        _SoloAdminValidator.validateUpdateRequest(body);

        const currentSolo = await UserSolo.findOne({
            where: {
                user_id: body.trainee_id,
            },
        });

        if (currentSolo == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const newDuration = currentSolo.solo_used + Number(body.solo_duration);
        await currentSolo.update({
            solo_used: newDuration,
            current_solo_end: dayjs.utc(currentSolo.current_solo_start).add(newDuration, "days").toDate(),
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    createSolo,
    updateSolo,
};
