import { NextFunction, Request, Response } from "express";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import EndorsementGroupValidator from "../_validators/EndorsementGroupValidator";
import { EndorsementGroupBelongsToStations } from "../../models/through/EndorsementGroupBelongsToStations";
import { HttpStatusCode } from "axios";
import { TrainingStation } from "../../models/TrainingStation";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { User } from "../../models/User";

/**
 * Gets a collection of all endorsement groups
 * @param request
 * @param response
 * @param next
 */
async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const endorsementGroups = await EndorsementGroup.findAll();
        response.send(endorsementGroups);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a collection of Endorsementgroups with their respective stations
 * @param request
 * @param response
 * @param next
 */
async function getAllWithStations(request: Request, response: Response, next: NextFunction) {
    try {
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
        const params = request.params as { id: string };
        EndorsementGroupValidator.validateGetByIDRequest(params);

        const endorsementGroup = await EndorsementGroup.findByPk(params.id);

        if (endorsementGroup == null) {
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
        const params = request.params as { id: string };
        EndorsementGroupValidator.validateDeleteRequest(params);

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
        const params = request.params as { id: string };
        EndorsementGroupValidator.validateGetByIDRequest(params);

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

async function updateByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };
        const body = request.body as { name: string };
        EndorsementGroupValidator.validateGetByIDRequest(params);
        EndorsementGroupValidator.validateUpdateRequest(body);

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
        const params = request.params as { id: string };
        const body = request.body as { training_station_id: number };
        EndorsementGroupValidator.validateGetByIDRequest(params);
        EndorsementGroupValidator.validateStationRequest(body);

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
        const params = request.params as { id: string };
        const body = request.body as { training_station_id: number };
        EndorsementGroupValidator.validateGetByIDRequest(params);
        EndorsementGroupValidator.validateStationRequest(body);

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
        EndorsementGroupValidator.validateGetByIDRequest(params);

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

        if (endorsementGroup == null || endorsementGroup.users == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(endorsementGroup.users);
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
        const params = request.params as { id: string };
        const data = request.body as { user_id: number };
        EndorsementGroupValidator.validateGetByIDRequest(params);
        EndorsementGroupValidator.validateRemoveUserRequest(data);

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
