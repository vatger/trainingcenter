import { Router } from "express";
import { TrainingStation } from "../../../models/TrainingStation";

export const TrainingStationAdminRouter = Router();

TrainingStationAdminRouter.get("/", async (request, response) => {
    const d = await TrainingStation.findAll();
    // TODO: move to controller
    response.send(d);
});
