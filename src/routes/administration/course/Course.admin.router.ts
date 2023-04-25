import { Request, Response, Router } from "express";
import { CourseInformationAdminRouter } from "./CourseInformation.admin.router";
import CourseAdministrationController from "../../../controllers/course/Course.admin.controller";

// Path: "/administration/course"
export const CourseAdminRouter = Router();

CourseAdminRouter.use("/info", CourseInformationAdminRouter);

CourseAdminRouter.get("/", async (request: Request, response: Response) => {
    await CourseAdministrationController.getAll(request, response);
});

CourseAdminRouter.put("/", async (request: Request, response: Response) => {
    await CourseAdministrationController.create(request, response);
});

CourseAdminRouter.get("/editable", async (request: Request, response: Response) => {
    await CourseAdministrationController.getEditable(request, response);
});
