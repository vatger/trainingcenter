import { Request, Response, Router } from "express";
import CourseInformationController from "../../../controllers/course/CourseInformation.controller";

// Path: "/course/info"
export const CourseInformationRouter = Router();

CourseInformationRouter.get("/", async (request: Request, response: Response) => {
    await CourseInformationController.getInformationByUUID(request, response);
});

CourseInformationRouter.get("/my", async (request: Request, response: Response) => {
    await CourseInformationController.getUserCourseInformationByUUID(request, response);
});

CourseInformationRouter.get("/training", async (request: Request, response: Response) => {
    await CourseInformationController.getCourseTrainingInformationByUUID(request, response);
});
