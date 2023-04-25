import { Request, Response, Router } from "express";
import GDPRController from "../../controllers/user/GDPR.controller";

export const GDPRRouter = Router();

GDPRRouter.get("/", async (request: Request, response: Response) => {
    await GDPRController.getData(request, response);
});
