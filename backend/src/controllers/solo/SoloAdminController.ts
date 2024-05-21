import { NextFunction, Request, Response } from "express";
import { UserSolo } from "../../models/UserSolo";
import dayjs from "dayjs";
import { HttpStatusCode } from "axios";
import { User } from "../../models/User";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { TrainingSession } from "../../models/TrainingSession";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { createSolo as vateudCreateSolo, removeSolo as vateudRemoveSolo } from "../../libraries/vateud/VateudCoreLibrary";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { sequelize } from "../../core/Sequelize";

type CreateSoloRequestBody = {
    solo_duration: string;
    solo_start: string;
    trainee_id: number;
    endorsement_group_id: string;
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type UpdateSoloRequestBody = Optional<CreateSoloRequestBody, "endorsement_group_id">;

// TODO: Do we need to validate if a mentor is allowed to assign a solo to a specific user?
// TODO: i.e. only if the user is in a course of the mentor, or do we trust mentors? :)

/**
 * Create a new Solo
 * @param request
 * @param response
 * @param next
 */
async function createSolo(request: Request, response: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();

    try {
        const user: User = response.locals.user;
        const body = request.body as CreateSoloRequestBody;
        Validator.validate(body, {
            solo_duration: [ValidationTypeEnum.NON_NULL],
            solo_start: [ValidationTypeEnum.NON_NULL],
            trainee_id: [ValidationTypeEnum.NON_NULL],
            endorsement_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const startDate = dayjs.utc(body.solo_start);
        const endDate = startDate.add(Number(body.solo_duration), "days");

        const solo = await UserSolo.create(
            {
                user_id: body.trainee_id,
                created_by: user.id,
                solo_used: Number(body.solo_duration),
                extension_count: 0,
                current_solo_start: startDate.toDate(),
                current_solo_end: endDate.toDate(),
            },
            {
                transaction: transaction,
            }
        );

        await EndorsementGroupsBelongsToUsers.create(
            {
                user_id: body.trainee_id,
                created_by: user.id,
                endorsement_group_id: Number(body.endorsement_group_id),
                solo_id: solo.id,
            },
            {
                transaction: transaction,
            }
        );

        const endorsementGroup = await EndorsementGroup.findOne({
            where: {
                id: Number(body.endorsement_group_id),
            },
        });

        //if (endorsementGroup) await vateudCreateSolo(solo, endorsementGroup);

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

        await transaction.commit();
        response.status(HttpStatusCode.Created).send(returnUser);
    } catch (e) {
        await transaction.rollback();
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
    const transaction = await sequelize.transaction();
    try {
        const body = request.body as UpdateSoloRequestBody & { endorsement_group_id?: string };
        Validator.validate(body, {
            endorsement_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const currentSolo = await UserSolo.findOne({
            where: {
                user_id: body.trainee_id,
            },
        });

        if (currentSolo == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        // We are trying to assign a new endorsement group, so remove all old ones first
        await EndorsementGroupsBelongsToUsers.destroy({
            where: {
                user_id: body.trainee_id,
                solo_id: currentSolo.id,
            },
            transaction: transaction,
        });

        await EndorsementGroupsBelongsToUsers.create(
            {
                user_id: body.trainee_id,
                endorsement_group_id: Number(body.endorsement_group_id),
                solo_id: currentSolo.id,
                created_by: response.locals.user.id,
            },
            {
                transaction: transaction,
            }
        );

        const newDuration = currentSolo.solo_used + Number(body.solo_duration);

        // If solo_start == NULL, then the solo is still active
        if (body.solo_start == null) {
            await currentSolo.update(
                {
                    created_by: response.locals.user.id,
                    solo_used: newDuration,
                    current_solo_end: dayjs.utc(currentSolo.current_solo_start).add(newDuration, "days").toDate(),
                },
                {
                    transaction: transaction,
                }
            );
        } else {
            // If solo_start != NULL, then the solo is inactive and the new days have to be calculated (newDuration, for example, isn't correct! It's start_date + Number(body.solo_duration)
            // Else we'll add the entire solo duration to the length again :).
            await currentSolo.update(
                {
                    created_by: response.locals.user.id,
                    solo_used: newDuration,
                    current_solo_start: dayjs.utc(body.solo_start).toDate(),
                    current_solo_end: dayjs.utc(body.solo_start).add(Number(body.solo_duration), "days").toDate(),
                },
                {
                    transaction: transaction,
                }
            );
        }

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

        await transaction.commit();
        response.send(returnUser);
    } catch (e) {
        await transaction.rollback();
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
        Validator.validate(body, {
            trainee_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

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

        let cpt_planned = false;
        let training_last_20_days = false;
        for (const trainingSession of user?.training_sessions ?? []) {
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
                user_id: user?.id,
            },
        });

        if (solo == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await solo.update({
            extension_count: solo.extension_count + 1,
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

async function deleteSolo(request: Request, response: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "atd.solo.delete", true);

        const body = request.body as { trainee_id: string; solo_id: string };
        Validator.validate(body, {
            trainee_id: [ValidationTypeEnum.NON_NULL],
            solo_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const solo = await UserSolo.findOne({
            where: {
                id: body.solo_id,
            },
            transaction: transaction,
        });

        // 1. Delete all endorsements that are linked to the solo.
        await EndorsementGroupsBelongsToUsers.destroy({
            where: {
                solo_id: body.solo_id,
            },
            transaction: transaction,
        });

        // 2. Delete the VATEUD Core Solo
        if (solo) await vateudRemoveSolo(solo);

        await UserSolo.destroy({
            where: {
                id: body.solo_id,
            },
            transaction: transaction,
        });

        const returnUser = await User.findOne({
            where: {
                id: body.trainee_id,
            },
            include: [User.associations.endorsement_groups],
        });

        await transaction.commit();
        response.send(returnUser);
    } catch (e) {
        await transaction.rollback();
        next(e);
    }
}

export default {
    createSolo,
    updateSolo,
    extendSolo,
    deleteSolo,
};
