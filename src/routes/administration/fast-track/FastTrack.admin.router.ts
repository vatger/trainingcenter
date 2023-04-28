import { Request, Response, Router } from "express";
import { handleUpload } from "../../../libraries/upload/FileUploadLibrary";
import { FastTrackRequest } from "../../../models/FastTrackRequest";
import { User } from "../../../models/User";
import FastTrackAdministrationController from "../../../controllers/fast-track/FastTrack.admin.controller";

// Path: "/administration/fast-track"
export const FastTrackAdminRouter: Router = Router();

FastTrackAdminRouter.post("/", FastTrackAdministrationController.create);

FastTrackAdminRouter.get("/user", FastTrackAdministrationController.getByUserID);
