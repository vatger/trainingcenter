import { Router } from "express";
import PermissionAdministrationController from "../../../controllers/permission/Permission.admin.controller";

// Path: "/administration/permission"
export const PermissionAdminRouter = Router();

PermissionAdminRouter.get("/", PermissionAdministrationController.getAll);
PermissionAdminRouter.put("/", PermissionAdministrationController.create);
PermissionAdminRouter.delete("/", PermissionAdministrationController.destroy);
