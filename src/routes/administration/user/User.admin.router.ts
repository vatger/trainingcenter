import { Router } from "express";
import UserController from "../../../controllers/user/User.admin.controller";
import UserInformationAdminController from "../../../controllers/user/UserInformation.admin.controller";
import UserNoteAdminController from "../../../controllers/user/UserNote.admin.controller";

// Path: "/administration/user"
export const UserAdminRouter: Router = Router();

UserAdminRouter.get("/data/", UserInformationAdminController.getUserDataByID);
UserAdminRouter.get("/data/sensitive", UserInformationAdminController.getSensitiveUserDataByID);

UserAdminRouter.get("/notes", UserNoteAdminController.getGeneralUserNotes);

UserAdminRouter.get("/", UserController.getAll);
UserAdminRouter.get("/min", UserController.getAllUsersMinimalData);
UserAdminRouter.get("/sensitive", UserController.getAllSensitive);
