import { Request, Response, Router } from "express";
import RoleAdministrationController from "../../../controllers/permission/Role.admin.controller";
import { User } from "../../../models/User";
import permissionHelper from "../../../utility/helper/PermissionHelper";
import PermissionHelper from "../../../utility/helper/PermissionHelper";

// Path: "/administration/role"
export const RoleAdminRouter = Router();

RoleAdminRouter.get("/", RoleAdministrationController.getAll);
RoleAdminRouter.get("/:role_id", RoleAdministrationController.getByID);
RoleAdminRouter.patch("/:role_id", RoleAdministrationController.update);

RoleAdminRouter.put("/perm/:role_id", RoleAdministrationController.addPermission);
RoleAdminRouter.delete("/perm/:role_id", RoleAdministrationController.removePermission);
