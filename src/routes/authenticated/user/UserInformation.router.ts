import { Request, Response, Router } from "express";
import UserMentorGroupController from "../../../controllers/user/UserMentorGroup.controller";
import UserTrainingController from "../../../controllers/user/UserTraining.controller";

// Path: "/user-info"
export const UserInformationRouter = Router();

UserInformationRouter.get("/training-request", UserTrainingController.getRequests);
UserInformationRouter.get("/training-request/:course_uuid", UserTrainingController.getRequestsByUUID);

UserInformationRouter.get("/mentor-group", UserMentorGroupController.getMentorGroups);
UserInformationRouter.get("/mentor-group/cm", UserMentorGroupController.getCourseManagerMentorGroups);
