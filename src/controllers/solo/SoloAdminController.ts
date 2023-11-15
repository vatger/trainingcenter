import { NextFunction, Request, Response } from "express";
import _SoloAdminValidator from "./_SoloAdmin.validator";
import { UserSolo } from "../../models/UserSolo";
import dayjs from "dayjs";
import { HttpStatusCode } from "axios";
import { User } from "../../models/User";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { TrainingSession } from "../../models/TrainingSession";

type CreateSoloRequestBody = {
    solo_duration: string;
    solo_start: string;
    trainee_id: number;
    endorsement_group_id: string;
};

type UpdateSoloRequestBody = Omit<CreateSoloRequestBody, "endorsement_group_id">;

/**
 * Create a new Solo
 * @param request
 * @param response
 * @param next
 */
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
            include: [
                {
                    association: User.associations.user_solo,
                    include: [UserSolo.associations.solo_creator],
                },
                User.associations.endorsement_groups,
            ],
        });

        response.status(HttpStatusCode.Created).send(returnUser);
    } catch (e) {
        next(e);
    }
}

/**
 * Updates the solo (potentially using the contingent)
 * @param request
 * @param response
 * @param next
 */
async function updateSolo(request: Request, response: Response, next: NextFunction) {
    try {
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

        // If solo_start == NULL, then the solo is still active
        if (body.solo_start == null) {
            await currentSolo.update({
                created_by: request.body.user.id,
                solo_used: newDuration,
                current_solo_end: dayjs.utc(currentSolo.current_solo_start).add(newDuration, "days").toDate(),
            });
        } else {
            // If solo_start != NULL, then the solo is inactive and the new days have to be calculated (newDuration, for example, isn't correct! It's start_date + Number(body.solo_duration)
            // Else we'll add the entire solo duration to the length again :).
            await currentSolo.update({
                created_by: request.body.user.id,
                solo_used: newDuration,
                current_solo_start: dayjs.utc(body.solo_start).toDate(),
                current_solo_end: dayjs.utc(body.solo_start).add(Number(body.solo_duration), "days").toDate(),
            });
        }

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

/**
 * Validates and extends solo
 * @param request
 * @param response
 * @param next
 */
async function extendSolo(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { trainee_id: string };
        _SoloAdminValidator.validateExtensionRequest(body);

        // Check the user has had a training in the last 20 days.
        const user = await User.findOne({
            where: {
                id: body.trainee_id,
            },
            include: [
                {
                    association: User.associations.training_sessions,
                    include: [TrainingSession.associations.training_type],
                },
            ],
        });

        if (user == null || user.training_sessions == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        let cpt_planned = false;
        let training_last_20_days = false;
        for (const trainingSession of user.training_sessions) {
            if (
                trainingSession.date != null &&
                trainingSession.date > dayjs.utc().subtract(20, "days").startOf("day").toDate() &&
                trainingSession.training_type?.type != "cpt" &&
                trainingSession.TrainingSessionBelongsToUsers?.passed
            ) {
                training_last_20_days = true;
            }

            if (trainingSession.training_type?.type == "cpt") {
                cpt_planned = true;
            }
        }

        if (!cpt_planned || !training_last_20_days) {
            response.status(HttpStatusCode.BadRequest).send({
                cpt_planned: cpt_planned,
                training_last_20_days: training_last_20_days,
            });
            return;
        }

        // Here, both cases are valid, we can extend the solo no problem!
        const solo = await UserSolo.findOne({
            where: {
                user_id: user.id,
            },
        });

        if (solo == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    createSolo,
    updateSolo,
    extendSolo,
};
