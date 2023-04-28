import { Request, Response, Router } from "express";
import TrainingTypeAdministrationController from "../../../controllers/training-type/TrainingType.admin.controller";

// Path: "/administration/training-type"
export const TrainingTypeAdminRouter: Router = Router();

TrainingTypeAdminRouter.get("/", TrainingTypeAdministrationController.getAll);
TrainingTypeAdminRouter.put("/", TrainingTypeAdministrationController.create);

TrainingTypeAdminRouter.get("/:id", TrainingTypeAdministrationController.getByID);
TrainingTypeAdminRouter.put("/:id", TrainingTypeAdministrationController.update);

TrainingTypeAdminRouter.put("/station", TrainingTypeAdministrationController.addStation);
TrainingTypeAdminRouter.delete("/station", TrainingTypeAdministrationController.removeStation);
