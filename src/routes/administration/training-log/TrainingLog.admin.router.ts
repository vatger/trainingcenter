import { Router } from "express";
import { TrainingLogTemplateAdminRouter } from "./templates/TrainingLogTemplate.admin.router";

// Path: "/administration/training-log"
export const TrainingLogAdminRouter = Router();

TrainingLogAdminRouter.use("/template", TrainingLogTemplateAdminRouter);
