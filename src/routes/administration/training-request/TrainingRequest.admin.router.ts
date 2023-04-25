import { Request, Response, Router } from "express";
import TrainingRequestAdminController from "../../../controllers/training-request/TrainingRequest.admin.controller";

export const TrainingRequestAdminRouter = Router();

TrainingRequestAdminRouter.get("/", async (request: Request, response: Response) => {
    await TrainingRequestAdminController.getOpen(request, response);
});

TrainingRequestAdminRouter.get("/:uuid", async (request: Request, response: Response) => {
    await TrainingRequestAdminController.getByUUID(request, response);
});
