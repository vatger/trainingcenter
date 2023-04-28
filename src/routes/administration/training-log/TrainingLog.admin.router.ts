import {Router} from "express";
import LogTemplateAdministrationController from "../../../controllers/log-template/LogTemplate.admin.controller";

// Path: "/administration/training-log"
export const TrainingLogAdminRouter: Router = Router();

TrainingLogAdminRouter.get("/template/", LogTemplateAdministrationController.getAll);
TrainingLogAdminRouter.put("/template/", LogTemplateAdministrationController.create);

TrainingLogAdminRouter.get("/template/min", LogTemplateAdministrationController.getAllMinimalData);