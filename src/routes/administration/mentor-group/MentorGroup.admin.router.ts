import { Request, Response, Router } from "express";
import MentorGroupAdministrationController from "../../../controllers/mentor-group/MentorGroup.admin.controller";

// Path: "/administration/mentor-group"
export const MentorGroupAdminRouter = Router();

MentorGroupAdminRouter.post("/", async (request: Request, response: Response) => {
    await MentorGroupAdministrationController.create(request, response);
});

MentorGroupAdminRouter.get("/admin", async (request: Request, response: Response) => {
    await MentorGroupAdministrationController.getAllAdmin(request, response);
});

MentorGroupAdminRouter.get("/course-manager", async (request: Request, response: Response) => {
    await MentorGroupAdministrationController.getAllCourseManager(request, response);
});

MentorGroupAdminRouter.get("/:mentor_group_id", async (request: Request, response: Response) => {
    await MentorGroupAdministrationController.getByID(request, response);
});
