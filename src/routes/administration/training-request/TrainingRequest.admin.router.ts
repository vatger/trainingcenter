import { Request, Response, Router } from "express";
import TrainingRequestAdminController from "../../../controllers/training-request/TrainingRequest.admin.controller";

export const TrainingRequestAdminRouter: Router = Router();

TrainingRequestAdminRouter.get("/", TrainingRequestAdminController.getOpen);
TrainingRequestAdminRouter.get("/:uuid", TrainingRequestAdminController.getByUUID);
