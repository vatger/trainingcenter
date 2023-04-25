import { Router } from "express";
import PermissionAdministrationController from "../../../controllers/permission/Permission.admin.controller";

// Path: "/administration/permission"
export const PermissionAdminRouter = Router();

PermissionAdminRouter.get("/", async (request, response) => {
    await PermissionAdministrationController.getAll(request, response);
});

PermissionAdminRouter.put("/", async (request, response) => {
    await PermissionAdministrationController.create(request, response);
});

PermissionAdminRouter.delete("/", async (request, response) => {
    await PermissionAdministrationController.destroy(request, response);
});
