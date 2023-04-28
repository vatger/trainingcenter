import { Router } from "express";
import TrainingRequestController from "../../../controllers/training-request/TrainingRequest.controller";

export const TrainingRequestRouter = Router();

TrainingRequestRouter.post("/", TrainingRequestController.create);
TrainingRequestRouter.delete("/", TrainingRequestController.destroy);

TrainingRequestRouter.get("/open", TrainingRequestController.getOpen);
TrainingRequestRouter.get("/:request_uuid", TrainingRequestController.getByUUID);
