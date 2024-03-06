import { NextFunction, Request, Response } from "express";
import { TrainingType } from "../../models/TrainingType";

async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        // const validation = ValidationHelper.validate([
        //     {
        //         name: "id",
        //         validationObject: params.id,
        //         toValidate: [{ val: ValidationOptions.NON_NULL }],
        //     },
        // ]);

        const trainingType = await TrainingType.findOne({
            where: {
                id: params.id,
            },
            attributes: ["id", "name", "type"],
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
