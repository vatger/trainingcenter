import { Request, Response, Router } from "express";
import { CourseInformationRouter } from "./CourseInformation.router";
import CourseController from "../../../controllers/course/Course.controller";
import UserCourseController from "../../../controllers/user/UserCourse.controller";

// Path: "/course"
export const CourseRouter = Router();

CourseRouter.use("/info", CourseInformationRouter);

CourseRouter.get("/", async (request: Request, response: Response) => {
    await CourseController.getAll(request, response);
});

CourseRouter.get("/my", async (request: Request, response: Response) => {
    await UserCourseController.getMyCourses(request, response);
});

CourseRouter.get("/available", async (request: Request, response: Response) => {
    await UserCourseController.getAvailableCourses(request, response);
});

CourseRouter.get("/active", async (request: Request, response: Response) => {
    await UserCourseController.getActiveCourses(request, response);
});

CourseRouter.put("/enrol", async (request: Request, response: Response) => {
    await UserCourseController.enrolInCourse(request, response);
});
