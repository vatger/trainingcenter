import { NextFunction, Response, Request } from "express";
import { TrainingStation } from "../../models/TrainingStation";
import { updateTrainingStations } from "../../libraries/vatger/GithubLibrary";
import { User } from "../../models/User";
import PermissionHelper from "../../utility/helper/PermissionHelper";

/**
 * Returns a list of all training stations (from the DataHub)
 * Required by all mentors that can create courses, endorsement groups, etc.
 * @param _request
 * @param response
 * @param next
 */
async function getAll(_request: Request, response: Response, next: NextFunction) {
    try {
        const trainingStations = await TrainingStation.findAll();
        response.send(trainingStations);
    } catch (e) {
        next(e);
    }
}

/**
 * Syncs the training stations with the DataHub
 * @param _request
 * @param response
 * @param next
 */
async function syncStations(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "atd.training_stations.sync");

        await updateTrainingStations();
        const newStations = await TrainingStation.findAll();
        response.send(newStations);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    syncStations,
};
