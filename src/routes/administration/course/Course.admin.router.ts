import { Router } from "express";
import CourseAdministrationController from "../../../controllers/course/Course.admin.controller";
import CourseInformationAdministrationController from "../../../controllers/course/CourseInformation.admin.controller";

// Path: "/administration/course"
export const CourseAdminRouter: Router = Router();

CourseAdminRouter.get("/", CourseAdministrationController.getAll);
CourseAdminRouter.put("/", CourseAdministrationController.create);

CourseAdminRouter.get("/editable", CourseAdministrationController.getEditable);

CourseAdminRouter.get("/info/", CourseInformationAdministrationController.getByUUID);
CourseAdminRouter.get("/info/mentor-group", CourseInformationAdministrationController.getMentorGroups);

CourseAdminRouter.get("/info/user", CourseInformationAdministrationController.getUsers);
CourseAdminRouter.patch("/info/update", CourseInformationAdministrationController.update);
CourseAdminRouter.delete("/info/user", CourseInformationAdministrationController.deleteUser);
CourseAdminRouter.delete("/info/mentor-group", CourseInformationAdministrationController.deleteMentorGroup);
