import { NextFunction, Request, Response, Router } from "express";
import SyslogAdminController from "../../../controllers/syslog/Syslog.admin.controller";

// Path: "/administration/syslog"
export const SyslogAdminRouter = Router();

SyslogAdminRouter.get("/", async (request, response) => {
    await SyslogAdminController.getAll(request, response);
});

SyslogAdminRouter.get("/:id", async (request: Request, response: Response, next: NextFunction) => {
    await SyslogAdminController.getInformationByID(request, response);
});
