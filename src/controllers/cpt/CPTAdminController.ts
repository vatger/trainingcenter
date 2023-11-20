import { NextFunction, Request, Response } from "express";
import { TrainingSession } from "../../models/TrainingSession";
import { Op } from "sequelize";
import dayjs from "dayjs";

async function getAvailable(request: Request, response: Response, next: NextFunction) {
    try {
        let availableCPTs = await TrainingSession.findAll({
            where: {
                date: {
                    [Op.gt]: dayjs.utc().toDate(),
                },
                cpt_examiner_id: null,
            },
            include: [
                TrainingSession.associations.training_type,
                TrainingSession.associations.users,
                TrainingSession.associations.training_station,
                TrainingSession.associations.mentor,
            ],
        });

        availableCPTs = availableCPTs.filter(c => {
            return c.training_type?.type == "cpt";
        });

        response.send(availableCPTs);
    } catch (e) {
        next(e);
    }
}

export default {
    getAvailable,
};
