import { NextFunction, Response, Request } from "express";
import axios, { HttpStatusCode } from "axios";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../../models/TrainingStation";
import _TrainingStationAdminValidator from "./_TrainingStationAdmin.validator";
import { Config } from "../../core/Config";
import { updateTrainingStations } from "../../libraries/vatger/GithubLibrary";

async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        const trainingStations = await TrainingStation.findAll();
        response.send(trainingStations);
    } catch (e) {
        next(e);
    }
}

async function getByID(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        const trainingStation = await TrainingStation.findOne({
            where: {
                id: params.id,
            },
        });

        if (trainingStation == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(trainingStation);
    } catch (e) {
        next(e);
    }
}

async function syncStations(request: Request, response: Response, next: NextFunction) {
    try {
        await updateTrainingStations();
        const newStations = await TrainingStation.findAll();
        response.send(newStations);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getByID,
    syncStations,
};