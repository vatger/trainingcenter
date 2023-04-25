import { Request, Response, Router } from "express";
import RoleAdministrationController from "../../../controllers/permission/Role.admin.controller";
import { User } from "../../../models/User";
import permissionHelper from "../../../utility/helper/PermissionHelper";
import PermissionHelper from "../../../utility/helper/PermissionHelper";

// Path: "/administration/role"
export const RoleAdminRouter = Router();

RoleAdminRouter.get("/", async (request, response) => {
    await RoleAdministrationController.getAll(request, response);
});

RoleAdminRouter.get("/:role_id", async (request: Request, response: Response) => {
    await RoleAdministrationController.getByID(request, response);
});

RoleAdminRouter.patch("/:role_id", async (request: Request, response: Response) => {
    await RoleAdministrationController.update(request, response);
});

RoleAdminRouter.put("/perm/:role_id", async (request: Request, response: Response) => {
    if (!PermissionHelper.checkUserHasPermission(request.body.user, response, "tech.permissions.role.edit", true)) return;

    await RoleAdministrationController.addPermission(request, response);
});

RoleAdminRouter.delete("/perm/:role_id", async (request: Request, response: Response) => {
    if (!PermissionHelper.checkUserHasPermission(request.body.user, response, "tech.permissions.role.edit", true)) return;

    await RoleAdministrationController.removePermission(request, response);
});
