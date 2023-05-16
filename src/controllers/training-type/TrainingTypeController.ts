import { Request, Response } from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { TrainingType } from "../../models/TrainingType";

async function getByID(request: Request, response: Response) {
    const trainingTypeID = request.params.id;

    const validation = ValidationHelper.validate([
        {
            name: "id",
            validationObject: trainingTypeID,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const trainingType = await TrainingType.findOne({
        where: {
            id: trainingTypeID?.toString(),
        },
        attributes: ["id", "name", "type"],
        include: {
            association: TrainingType.associations.training_stations,
            attributes: ["id", "callsign", "frequency", "deactivated"],
            through: {
                attributes: [],
            },
        },
    });

    response.send(trainingType);
}

export default {
    getByID,
};
