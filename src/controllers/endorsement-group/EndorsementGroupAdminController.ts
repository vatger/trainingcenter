import { NextFunction, Request, Response } from "express";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import EndorsementGroupValidator from "../_validators/EndorsementGroupValidator";
import { EndorsementGroupBelongsToStations } from "../../models/through/EndorsementGroupBelongsToStations";
import { HttpStatusCode } from "axios";

/**
 * Creates a new Endorsement Group
 * @param request
 * @param response
 * @param next
 */
async function createEndorsementGroup(request: Request, response: Response, next: NextFunction) {
    try {
        const body = request.body as { name: string; training_station_ids: number[] };
        EndorsementGroupValidator.validateCreateRequest(body);

        const endorsementGroup = await EndorsementGroup.create({
            name: body.name,
        });

        for (const tID of body.training_station_ids) {
            await EndorsementGroupBelongsToStations.create({
                endorsement_group_id: endorsementGroup.id,
                station_id: tID,
            });
        }

        response.status(HttpStatusCode.Created).send(endorsementGroup);
    } catch (e) {
        next(e);
    }
}

export default {
    createEndorsementGroup,
};
