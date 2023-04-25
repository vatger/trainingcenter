import { Request, Response, Router } from "express";
import UserInformationAdminController from "../../../controllers/user/UserInformation.admin.controller";

// Path: "/administration/user/data"
export const UserInformationAdminRouter = Router();

UserInformationAdminRouter.get("/", async (request: Request, response: Response) => {
    await UserInformationAdminController.getUserDataByID(request, response);
});

UserInformationAdminRouter.get("/sensitive", async (request: Request, response: Response) => {
    await UserInformationAdminController.getSensitiveUserDataByID(request, response);
});
