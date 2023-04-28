import { Request, Response, Router } from "express";
import MentorGroupAdministrationController from "../../../controllers/mentor-group/MentorGroup.admin.controller";

// Path: "/administration/mentor-group"
export const MentorGroupAdminRouter = Router();

MentorGroupAdminRouter.post("/", MentorGroupAdministrationController.create);

MentorGroupAdminRouter.get("/admin", MentorGroupAdministrationController.getAllAdmin);

MentorGroupAdminRouter.get("/course-manager", MentorGroupAdministrationController.getAllCourseManager);

MentorGroupAdminRouter.get("/:mentor_group_id", MentorGroupAdministrationController.getByID);
