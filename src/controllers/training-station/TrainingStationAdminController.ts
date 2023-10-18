import { NextFunction, Response, Request } from "express";
import axios, { HttpStatusCode } from "axios";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../../models/TrainingStation";
import _TrainingStationAdminValidator from "./_TrainingStationAdmin.validator";
import { Config } from "../../core/Config";

type HomepageStation = {
    id: number;
    name: string;
    ident: string;
    frequency: number;
};

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

async function update(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };
        const body = request.body as { callsign: string; frequency: string };

        _TrainingStationAdminValidator.validateUpdateStation(body);

        const trainingStation = await TrainingStation.findOne({
            where: {
                id: params.id,
            },
        });

        if (trainingStation == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await trainingStation.update({
            callsign: body.callsign,
            frequency: Number(body.frequency),
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

async function createStations(request: Request, response: Response, next: NextFunction) {
    const t = await sequelize.transaction();
    try {
        const body = request.body as { callsign: string }[];
        let homepageStations: HomepageStation[];

        _TrainingStationAdminValidator.validateCreateStations(body);

        const stationRequest = await axios.get(`${Config.URI_CONFIG.VATGER_API_BASE}/navigation/stations`, {
            headers: {
                Accept: "application/json",
                Referer: "https://vatsim-germany.org",
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        if (stationRequest.data == null || !Array.isArray(stationRequest.data)) {
            next(new Error());
            return;
        }

        homepageStations = stationRequest.data as HomepageStation[];

        for (const station of body) {
            const hStationFound = homepageStations.find(s => s.ident.toLowerCase() == station.callsign.toLowerCase());
            if (hStationFound == null) {
                continue;
            }

            await TrainingStation.create(
                {
                    callsign: station.callsign.toUpperCase(),
                    frequency: hStationFound.frequency,
                },
                {
                    transaction: t,
                }
            );
        }

        await t.commit();
        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        await t.rollback();
        next(e);
    }
}

async function destroy(request: Request, response: Response, next: NextFunction) {
    try {
        const params = request.params as { id: string };

        await TrainingStation.destroy({
            where: {
                id: params.id,
            },
        });

        response.sendStatus(HttpStatusCode.Ok);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    getByID,
    update,
    destroy,
    createStations,
};