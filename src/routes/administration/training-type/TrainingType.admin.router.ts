import { Request, Response, Router } from "express";
import TrainingTypeAdministrationController from "../../../controllers/training-type/TrainingType.admin.controller";

// Path: "/administration/training-type"
export const TrainingTypeAdminRouter = Router();

TrainingTypeAdminRouter.get("/", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.getAll(request, response);
});

TrainingTypeAdminRouter.get("/:id", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.getByID(request, response);
});

TrainingTypeAdminRouter.put("/:id", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.update(request, response);
});

TrainingTypeAdminRouter.put("/", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.create(request, response);
});

TrainingTypeAdminRouter.put("/station", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.addStation(request, response);
});

TrainingTypeAdminRouter.delete("/station", async (request: Request, response: Response) => {
    await TrainingTypeAdministrationController.removeStation(request, response);
});
