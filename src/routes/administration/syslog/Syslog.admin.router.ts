import { NextFunction, Request, Response, Router } from "express";
import SyslogAdminController from "../../../controllers/syslog/Syslog.admin.controller";

// Path: "/administration/syslog"
export const SyslogAdminRouter: Router = Router();

SyslogAdminRouter.get("/", SyslogAdminController.getAll);
SyslogAdminRouter.get("/:id", SyslogAdminController.getInformationByID);
