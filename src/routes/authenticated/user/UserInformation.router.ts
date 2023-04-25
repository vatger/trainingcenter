import { Request, Response, Router } from "express";
import UserMentorGroupController from "../../../controllers/user/UserMentorGroup.controller";
import UserTrainingController from "../../../controllers/user/UserTraining.controller";

// Path: "/user-info"
export const UserInformationRouter = Router();

UserInformationRouter.get("/training-request", async (request: Request, response: Response) => {
    await UserTrainingController.getRequests(request, response);
});

UserInformationRouter.get("/training-request/:course_uuid", async (request: Request, response: Response) => {
    await UserTrainingController.getRequestsByUUID(request, response);
});

UserInformationRouter.get("/mentor-group", async (request, response) => {
    await UserMentorGroupController.getMentorGroups(request, response);
});

UserInformationRouter.get("/mentor-group/cm", async (request: Request, response: Response) => {
    await UserMentorGroupController.getCourseManagerMentorGroups(request, response);
});
