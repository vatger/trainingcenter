import { Request, Response, Router } from "express";
import LogTemplateAdministrationController from "../../../../controllers/log-template/LogTemplate.admin.controller";

// Path: "/administration/training-log/template"
export const TrainingLogTemplateAdminRouter = Router();

TrainingLogTemplateAdminRouter.get("/", async (request: Request, response: Response) => {
    await LogTemplateAdministrationController.getAll(request, response);
});

TrainingLogTemplateAdminRouter.put("/", async (request: Request, response: Response) => {
    await LogTemplateAdministrationController.create(request, response);
});

TrainingLogTemplateAdminRouter.get("/min", async (request: Request, response: Response) => {
    await LogTemplateAdministrationController.getAllMinimalData(request, response);
});
