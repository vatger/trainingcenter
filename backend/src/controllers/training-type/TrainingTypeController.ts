import { NextFunction, Request, Response } from "express";
import { TrainingType } from "../../models/TrainingType";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";

/**
 * Returns a training type by its ID
 * @param request
 * @param response
 * @param next
 */
async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        Validator.validate(params, {
            id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const trainingType = await TrainingType.findOne({
            where: {
                id: params.id,
            },
            attributes: ["id", "name", "type", "description"],
            include: {
                association: TrainingType.associations.training_stations,
                attributes: ["id", "callsign", "frequency"],
                through: {
                    attributes: [],
                },
            },
        });

        response.send(trainingType);
    } catch (e) {
        next(e);
    }
}

export default {
    getByID,
};
