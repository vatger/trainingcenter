import { Request, Response, Router } from "express";
import GDPRController from "../../controllers/user/GDPR.controller";

export const GDPRRouter = Router();

GDPRRouter.get("/", GDPRController.getData);
