import {Router} from "express";
import {TrainingStation} from "../models/TrainingStation";
import {authMiddleware} from "../middlewares/AuthMiddleware";
import LoginController from "../controllers/login/Login.controller";
import GDPRController from "../controllers/user/GDPR.controller";
import CourseController from "../controllers/course/Course.controller";
import UserCourseController from "../controllers/user/UserCourse.controller";
import CourseInformationController from "../controllers/course/CourseInformation.controller";
import UserTrainingController from "../controllers/user/UserTraining.controller";
import UserMentorGroupController from "../controllers/user/UserMentorGroup.controller";
import TrainingRequestController from "../controllers/training-request/TrainingRequest.controller";
import TrainingTypeController from "../controllers/training-type/TrainingType.controller";
import UserInformationAdminController from "../controllers/user/UserInformation.admin.controller";
import UserNoteAdminController from "../controllers/user/UserNote.admin.controller";
import UserController from "../controllers/user/User.admin.controller";
import TrainingRequestAdminController from "../controllers/training-request/TrainingRequest.admin.controller";
import CourseAdministrationController from "../controllers/course/Course.admin.controller";
import CourseInformationAdministrationController from "../controllers/course/CourseInformation.admin.controller";
import SkillTemplateAdministrationController from "../controllers/skill-template/SkillTemplate.admin.controller";
import TrainingTypeAdministrationController from "../controllers/training-type/TrainingType.admin.controller";
import FastTrackAdministrationController from "../controllers/fast-track/FastTrack.admin.controller";
import LogTemplateAdministrationController from "../controllers/log-template/LogTemplate.admin.controller";
import MentorGroupAdministrationController from "../controllers/mentor-group/MentorGroup.admin.controller";
import SyslogAdminController from "../controllers/syslog/Syslog.admin.controller";
import PermissionAdministrationController from "../controllers/permission/Permission.admin.controller";
import RoleAdministrationController from "../controllers/permission/Role.admin.controller";

// TODO, Add try catch around every route :) -> to handle internal server errors with response 500

const group = ((callback: (router: Router) => void) => {
    const router = Router();
    callback(router);
    return router;
});

// Path: "/"
export const router = Router();

router.use("/auth", group((r: Router) => {
    r.get("/url", LoginController.getRedirectUri);
    r.get("/data", LoginController.getUserData);
    r.get("/check", LoginController.validateSessionToken);

    r.post("/login", LoginController.login);
    r.post("/logout", LoginController.logout);
}));

router.use("/", group((r: Router) => {
    r.use(authMiddleware);

    r.get("/gdpr", GDPRController.getData);

    r.use("/course", group((r: Router) => {
        r.get("/", CourseController.getAll);
        r.get("/my", UserCourseController.getMyCourses);
        r.get("/available", UserCourseController.getAvailableCourses);
        r.get("/active", UserCourseController.getActiveCourses);
        r.put("/enrol", UserCourseController.enrolInCourse);

        r.get("/info", CourseInformationController.getInformationByUUID);
        r.get("/info/my", CourseInformationController.getUserCourseInformationByUUID);
        r.get("/info/training", CourseInformationController.getCourseTrainingInformationByUUID);
    }));

    r.use("/user-info", group((r: Router) => {
        r.get("/training-request", UserTrainingController.getRequests);
        r.get("/training-request/:course_uuid", UserTrainingController.getRequestsByUUID);

        r.get("/mentor-group", UserMentorGroupController.getMentorGroups);
        r.get("/mentor-group/cm", UserMentorGroupController.getCourseManagerMentorGroups);
    }));

    r.use("/training-request", group((r: Router) => {
        r.post("/", TrainingRequestController.create);
        r.delete("/", TrainingRequestController.destroy);

        r.get("/open", TrainingRequestController.getOpen);
        r.get("/:request_uuid", TrainingRequestController.getByUUID);
    }));

    r.use("/training-type", group((r: Router) => {
        r.get("/:id", TrainingTypeController.getByID);
    }));
}));

router.use("/administration", group((r: Router) => {
    r.use("/user", group((r: Router) => {
        r.get("/data/", UserInformationAdminController.getUserDataByID);
        r.get("/data/sensitive", UserInformationAdminController.getSensitiveUserDataByID);

        r.get("/notes", UserNoteAdminController.getGeneralUserNotes);

        r.get("/", UserController.getAll);
        r.get("/min", UserController.getAllUsersMinimalData);
        r.get("/sensitive", UserController.getAllSensitive);
    }));

    r.use("/training-request", group((r: Router) => {
        r.get("/", TrainingRequestAdminController.getOpen);
        r.get("/:uuid", TrainingRequestAdminController.getByUUID);
    }));

    r.use("/course", group((r: Router) => {
        r.get("/", CourseAdministrationController.getAll);
        r.put("/", CourseAdministrationController.create);

        r.get("/editable", CourseAdministrationController.getEditable);

        r.get("/info/", CourseInformationAdministrationController.getByUUID);
        r.get("/info/mentor-group", CourseInformationAdministrationController.getMentorGroups);

        r.get("/info/user", CourseInformationAdministrationController.getUsers);
        r.patch("/info/update", CourseInformationAdministrationController.update);
        r.delete("/info/user", CourseInformationAdministrationController.deleteUser);
        r.delete("/info/mentor-group", CourseInformationAdministrationController.deleteMentorGroup);
    }));

    r.use("/course-skill-template", group((r: Router) => {
        r.get("/", SkillTemplateAdministrationController.getAll);
    }));

    r.use("/training-type", group((r: Router) => {
        r.get("/", TrainingTypeAdministrationController.getAll);
        r.put("/", TrainingTypeAdministrationController.create);

        r.get("/:id", TrainingTypeAdministrationController.getByID);
        r.patch("/:id", TrainingTypeAdministrationController.update);

        r.put("/station", TrainingTypeAdministrationController.addStation);
        r.delete("/station", TrainingTypeAdministrationController.removeStation);
    }));

    r.use("/fast-track", group((r: Router) => {
        r.post("/", FastTrackAdministrationController.create);
        r.get("/user", FastTrackAdministrationController.getByUserID);
    }));

    r.use("/training-log", group((r: Router) => {
        r.get("/template/", LogTemplateAdministrationController.getAll);
        r.put("/template/", LogTemplateAdministrationController.create);

        r.get("/template/min", LogTemplateAdministrationController.getAllMinimalData);
    }));

    r.use("/mentor-group", group((r: Router) => {
        r.post("/", MentorGroupAdministrationController.create);

        r.get("/admin", MentorGroupAdministrationController.getAllAdmin);

        r.get("/course-manager", MentorGroupAdministrationController.getAllCourseManager);

        r.get("/:mentor_group_id", MentorGroupAdministrationController.getByID);
    }));

    r.use("/training-station", group((r: Router) => {
        r.get("/", async (request, response) => {
            const d = await TrainingStation.findAll();
            // TODO: move to controller
            response.send(d);
        });
    }));

    r.use("/syslog", group((r: Router) => {
        r.get("/", SyslogAdminController.getAll);
        r.get("/:id", SyslogAdminController.getInformationByID);
    }));

    r.use("/permission", group((r: Router) => {
        r.get("/", PermissionAdministrationController.getAll);
        r.put("/", PermissionAdministrationController.create);
        r.delete("/", PermissionAdministrationController.destroy);
    }));

    r.use("/role", group((r: Router) => {
        r.get("/", RoleAdministrationController.getAll);
        r.get("/:role_id", RoleAdministrationController.getByID);
        r.patch("/:role_id", RoleAdministrationController.update);

        r.put("/perm/:role_id", RoleAdministrationController.addPermission);
        r.delete("/perm/:role_id", RoleAdministrationController.removePermission);
    }));
}));