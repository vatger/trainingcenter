import { Request, Response, Router } from "express";
import UserController from "../../../controllers/user/User.admin.controller";
import { UserInformationAdminRouter } from "./UserInformation.admin.router";
import { UserNoteAdminRouter } from "./UserNote.admin.router";

// Path: "/administration/user"
export const UserAdminRouter = Router();

UserAdminRouter.use("/data", UserInformationAdminRouter);
UserAdminRouter.use("/notes", UserNoteAdminRouter);

UserAdminRouter.get("/", async (request: Request, response: Response) => {
    await UserController.getAll(request, response);
});

UserAdminRouter.get("/min", async (request: Request, response: Response) => {
    await UserController.getAllUsersMinimalData(request, response);
});

UserAdminRouter.get("/sensitive", async (request: Request, response: Response) => {
    await UserController.getAllSensitive(request, response);
});
