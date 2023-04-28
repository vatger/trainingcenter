import { Request, Response, Router } from "express";
import CourseController from "../../../controllers/course/Course.controller";
import UserCourseController from "../../../controllers/user/UserCourse.controller";
import CourseInformationController from "../../../controllers/course/CourseInformation.controller";

// Path: "/course"
export const CourseRouter = Router();

CourseRouter.get("/", CourseController.getAll);
CourseRouter.get("/my", UserCourseController.getMyCourses);
CourseRouter.get("/available", UserCourseController.getAvailableCourses);
CourseRouter.get("/active", UserCourseController.getActiveCourses);
CourseRouter.put("/enrol", UserCourseController.enrolInCourse);

CourseRouter.get("/info", CourseInformationController.getInformationByUUID);
CourseRouter.get("/info/my", CourseInformationController.getUserCourseInformationByUUID);
CourseRouter.get("/info/training", CourseInformationController.getCourseTrainingInformationByUUID);
