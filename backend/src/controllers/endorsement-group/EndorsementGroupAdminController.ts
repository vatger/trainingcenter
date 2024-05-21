import { NextFunction, Request, Response } from "express";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { EndorsementGroupBelongsToStations } from "../../models/through/EndorsementGroupBelongsToStations";
import { HttpStatusCode } from "axios";
import { TrainingStation } from "../../models/TrainingStation";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { User } from "../../models/User";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import PermissionHelper from "../../utility/helper/PermissionHelper";

/**
 * Returns all Endorsement groups that are mentorable by the current user
 * @param _request
 * @param response
 * @param next
 */
async function getMentorable(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const userMentorGroups = await user.getMentorGroups();

        if (userMentorGroups.length == 0) {
            throw new ForbiddenException("No mentor groups are assigned to this user.");
        }

        let endorsementGroups: EndorsementGroup[] = [];
        for (const m of userMentorGroups) {
            const egs = await m.getEndorsementGroups();

            for (const eg of egs) {
                if (endorsementGroups.find(e => e.id === eg.id) == null) {
                    endorsementGroups.push(eg);
                }
            }
        }

        response.send(endorsementGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets a collection of all endorsement groups
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.view");

        const endorsementGroups = await EndorsementGroup.findAll();
        response.send(endorsementGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a collection of EndorsementGroups with their respective stations
 * @param _request
 * @param response
 * @param next
 */
async function getAllWithStations(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const endorsementGroups = await EndorsementGroup.findAll({
            include: {
                association: EndorsementGroup.associations.stations,
                attributes: ["callsign", "frequency"],
                through: {
                    attributes: [],
                },
            },
        });
        response.send(endorsementGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Get single instance of endorsement group by ID (PK)
 * @param request
 * @param response
 * @param next
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.view");

        const endorsementGroup = await EndorsementGroup.findByPk(params.id);

        if (!endorsementGroup) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(endorsementGroup);
    } catch (e) {
        next(e);
    }
}

/**
 * Deletes an endorsement group by its id
 * @param request
 * @param response
 * @param next
 */
async function deleteByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.edit");

        await EndorsementGroup.destroy({
            where: {
                id: params.id,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns collection of TrainingStations from a given EndorsementGroup provided its ID (PK).
 * @param request
 * @param response
 * @param next
 */
async function getStationsByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.view");

        const endorsementGroup = await EndorsementGroup.findOne({
            where: {
                id: params.id,
            },
            include: [
                {
                    association: EndorsementGroup.associations.stations,
                    through: { attributes: [] },
                },
            ],
        });

        if (endorsementGroup == null || endorsementGroup.stations == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(endorsementGroup.stations);
    } catch (e) {
        next(e);
    }
}

/**
 * Updates an endorsement group
 * @param request
 * @param response
 * @param next
 */
async function updateByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const body = request.body as { name: string };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.edit");

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
        });

        let endorsementGroup = await EndorsementGroup.findByPk(params.id);

        if (endorsementGroup == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        endorsementGroup = await endorsementGroup.update({
            name: body.name,
        });

        response.send(endorsementGroup);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a station with the specified ID to an endorsement group also specified by its ID (PK)
 * @param request
 * @param response
 * @param next
 */
async function addStationByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const body = request.body as { training_station_id: number };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.edit");

        Validator.validate(body, {
            training_station_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const endorsementGroup = await EndorsementGroup.findByPk(params.id);
        const trainingStation = await TrainingStation.findByPk(body.training_station_id);
        if (endorsementGroup == null || trainingStation == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await EndorsementGroupBelongsToStations.create({
            endorsement_group_id: endorsementGroup.id,
            station_id: body.training_station_id,
        });

        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a station with the specified ID from an endorsement group also specified by its ID (PK)
 * @param request
 * @param response
 * @param next
 */
async function removeStationByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const body = request.body as { training_station_id: number };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.edit");

        Validator.validate(body, {
            training_station_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const endorsementGroup = await EndorsementGroup.findByPk(params.id);
        const trainingStation = await TrainingStation.findByPk(body.training_station_id);
        if (endorsementGroup == null || trainingStation == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await EndorsementGroupBelongsToStations.destroy({
            where: {
                endorsement_group_id: endorsementGroup.id,
                station_id: body.training_station_id,
            },
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a collection of users that are in the specified EndorsementGroup
 * @param request
 * @param response
 * @param next
 */
async function getUsersByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        const endorsementGroup = await EndorsementGroup.findOne({
            where: {
                id: params.id,
            },
            include: [
                {
                    association: EndorsementGroup.associations.users,
                    include: [User.associations.user_solo],
                    through: { attributes: { exclude: ["id", "endorsement_group_id", "user_id", "solo_rating", "updated_at"] } },
                },
            ],
        });

        response.send(endorsementGroup?.users ?? []);
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a given user from the endorsement group
 * @param request
 * @param response
 * @param next
 */
async function removeUserByID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { id: string };
        const data = request.body as { user_id: number };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.edit");

        const endorsementGroup = await EndorsementGroup.findByPk(params.id);
        if (endorsementGroup == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await EndorsementGroupsBelongsToUsers.destroy({
            where: {
                endorsement_group_id: params.id,
                user_id: data.user_id,
            },
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates a new Endorsement Group
 * @param request
 * @param response
 * @param next
 */
async function createEndorsementGroup(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { name: string; name_vateud: string; tier: number; training_station_ids: number[] };

        PermissionHelper.checkUserHasPermission(user, "lm.endorsement_groups.create");

        Validator.validate(body, {
            name: [ValidationTypeEnum.NON_NULL],
            name_vateud: [ValidationTypeEnum.NON_NULL],
            training_station_ids: [ValidationTypeEnum.IS_ARRAY, ValidationTypeEnum.VALID_JSON],
        });

        const endorsementGroup = await EndorsementGroup.create({
            name: body.name,
            name_vateud: body.name_vateud,
            tier: body.tier,
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
    getMentorable,
    getAll,
    getAllWithStations,
    getByID,
    deleteByID,
    updateByID,
    getStationsByID,
    addStationByID,
    removeStationByID,
    getUsersByID,
    removeUserByID,
    createEndorsementGroup,
};
