import { Request, Response, Router } from "express";
import CourseInformationAdministrationController from "../../../controllers/course/CourseInformation.admin.controller";

export const CourseInformationAdminRouter = Router();

CourseInformationAdminRouter.get("/", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.getByUUID(request, response);
});

CourseInformationAdminRouter.get("/mentor-group", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.getMentorGroups(request, response);
});

CourseInformationAdminRouter.delete("/mentor-group", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.deleteMentorGroup(request, response);
});

CourseInformationAdminRouter.get("/user", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.getUsers(request, response);
});

CourseInformationAdminRouter.delete("/user", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.deleteUser(request, response);
});

CourseInformationAdminRouter.patch("/update", async (request: Request, response: Response) => {
    await CourseInformationAdministrationController.update(request, response);
});
