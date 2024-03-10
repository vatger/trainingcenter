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
    gcap_status?: string;
    gcap_training_airport?: boolean;
    s1_twr?: boolean;
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

type DataHubStations = {
    logon: string;
    frequency: string;
    abbreviation: string;
    description: string;
};

async function syncStations(request: Request, response: Response, next: NextFunction) {
    try {
        const res = await axios.get("https://raw.githubusercontent.com/VATGER-Nav/datahub/main/data.json");
        const stations = res.data as DataHubStations[];

        for (const station of stations) {
            if (station.logon.length === 0 || station.frequency.length === 0) continue;

            const dbStation = await TrainingStation.findOne({ where: { callsign: station.logon } });
            if (dbStation == null) {
                await TrainingStation.create({
                    callsign: station.logon,
                    frequency: Number(station.frequency),
                });
                continue;
            }

            await dbStation.update({
                callsign: station.logon,
                frequency: Number(station.frequency),
            });
        }

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
