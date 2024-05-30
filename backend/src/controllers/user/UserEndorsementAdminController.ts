import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { HttpStatusCode } from "axios";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { createEndorsement, removeEndorsement } from "../../libraries/vateud/VateudCoreLibrary";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Adds an endorsement to a user
 * @param request
 * @param response
 * @param next
 */
async function addEndorsement(request: Request, response: Response, next: NextFunction) {
    try {
        const requestingUser: User = response.locals.user;
        const body = request.body as { user_id: string; endorsement_group_id: string };

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            endorsement_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const endorsementGroup = await EndorsementGroup.findOne({
            where: {
                id: Number(body.endorsement_group_id),
            },
        });

        if (endorsementGroup == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        if (!(await endorsementGroup.userCanEndorse(requestingUser))) {
            throw new ForbiddenException("You are not allowed to endorse this group");
        }

        const userEndorsement = await EndorsementGroupsBelongsToUsers.create({
            user_id: Number(body.user_id),
            endorsement_group_id: endorsementGroup.id,
            created_by: requestingUser.id,
        });



        if (!(await createEndorsement(userEndorsement, endorsementGroup))) {
            await userEndorsement.destroy();
            throw new Error("Could not create endorsement in VATEUD CORE.");
        }


        response.status(HttpStatusCode.Created).send(endorsementGroup);
    } catch (e) {
        next(e);
    }
}

/**
 * Deletes an endorsement to a user
 * @param request
 * @param response
 * @param next
 */
async function deleteEndorsement(request: Request, response: Response, next: NextFunction) {
    try {
        const requestingUser: User = response.locals.user;
        const body = request.body as { user_id: string; endorsement_group_id: string };

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            endorsement_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const userEndorsement = await EndorsementGroupsBelongsToUsers.findOne({
            where: {
                user_id: body.user_id,
                endorsement_group_id: body.endorsement_group_id,
            },
        });

        const endorsementGroup = await EndorsementGroup.findOne({
            where: {
                id: userEndorsement?.endorsement_group_id ?? -1,
            },
        });

        if (endorsementGroup == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        if (!(await endorsementGroup.userCanEndorse(requestingUser))) {
            throw new ForbiddenException("You are not allowed to endorse this group");
        }

        const success = await removeEndorsement(userEndorsement, endorsementGroup);

        if (!success) {
            throw new Error("Could not delete endorsement in VATEUD CORE.");
        }

        await userEndorsement?.destroy();

        // Don't send anything back, we'll just remove it from the frontend
        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    addEndorsement,
    deleteEndorsement,
};
