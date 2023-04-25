import { Router } from "express";
import { CourseRouter } from "./course/Course.router";
import { UserInformationRouter } from "./user/UserInformation.router";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { TrainingRequestRouter } from "./training-request/TrainingRequest.router";
import { TrainingTypeRouter } from "./training-type/TrainingType.router";
import { GDPRRouter } from "../login/GDPR.router";

// Path: "/"
export const AuthenticatedRouter = Router();

AuthenticatedRouter.use(authMiddleware);

AuthenticatedRouter.use("/gdpr", GDPRRouter);
AuthenticatedRouter.use("/course", CourseRouter);
AuthenticatedRouter.use("/user-info", UserInformationRouter);
AuthenticatedRouter.use("/training-request", TrainingRequestRouter);
AuthenticatedRouter.use("/training-type", TrainingTypeRouter);
