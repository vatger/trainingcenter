import { Request, Response, Router } from "express";
import TrainingTypeController from "../../../controllers/training-type/TrainingType.controller";

export const TrainingTypeRouter = Router();

TrainingTypeRouter.get("/:id", async (request: Request, response: Response) => {
    await TrainingTypeController.getByID(request, response);
});
