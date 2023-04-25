import { Request, Response, Router } from "express";
import TrainingRequestController from "../../../controllers/training-request/TrainingRequest.controller";

export const TrainingRequestRouter = Router();

TrainingRequestRouter.post("/", async (request: Request, response: Response) => {
    await TrainingRequestController.create(request, response);
});

TrainingRequestRouter.delete("/", async (request: Request, response: Response) => {
    await TrainingRequestController.destroy(request, response);
});

TrainingRequestRouter.get("/open", async (request: Request, response: Response) => {
    await TrainingRequestController.getOpen(request, response);
});

TrainingRequestRouter.get("/:request_uuid", async (request: Request, response: Response) => {
    await TrainingRequestController.getByUUID(request, response);
});
