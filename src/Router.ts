import { Router } from "express";
import { TrainingStation } from "./models/TrainingStation";
import { authMiddleware } from "./middlewares/AuthMiddleware";
import LoginController from "./controllers/login/LoginController";
import GDPRController from "./controllers/user/GDPRController";
import CourseController from "./controllers/course/CourseController";
import UserCourseController from "./controllers/user/UserCourseController";
import CourseInformationController from "./controllers/course/CourseInformationController";
import UserTrainingController from "./controllers/user/UserTrainingController";
import UserMentorGroupController from "./controllers/user/UserMentorGroupController";
import TrainingRequestController from "./controllers/training-request/TrainingRequestController";
import TrainingTypeController from "./controllers/training-type/TrainingTypeController";
import UserInformationAdminController from "./controllers/user/UserInformationAdminController";
import UserNoteAdminController from "./controllers/user/UserNoteAdminController";
import UserController from "./controllers/user/UserAdminController";
import TrainingRequestAdminController from "./controllers/training-request/TrainingRequestAdminController";
import CourseAdministrationController from "./controllers/course/CourseAdminController";
import CourseInformationAdministrationController from "./controllers/course/CourseInformationAdminController";
import SkillTemplateAdministrationController from "./controllers/skill-template/SkillTemplateAdminController";
import TrainingTypeAdministrationController from "./controllers/training-type/TrainingTypeAdminController";
import FastTrackAdministrationController from "./controllers/fast-track/FastTrackAdminController";
import LogTemplateAdministrationController from "./controllers/log-template/LogTemplateAdminController";
import MentorGroupAdministrationController from "./controllers/mentor-group/MentorGroupAdminController";
import SyslogAdminController from "./controllers/syslog/SyslogAdminController";
import PermissionAdministrationController from "./controllers/permission/PermissionAdminController";
import RoleAdministrationController from "./controllers/permission/RoleAdminController";
import UserNotificationController from "./controllers/user/UserNotificationController";
import TrainingSessionAdminController from "./controllers/training-session/TrainingSessionAdminController";

const routerGroup = (callback: (router: Router) => void) => {
    const router = Router();
    callback(router);
    return router;
};

export const router = Router();

router.use(
    "/auth",
    routerGroup((r: Router) => {
        r.get("/url", LoginController.getRedirectUri);
        r.get("/data", LoginController.getUserData);
        r.get("/check", LoginController.validateSessionToken);

        r.post("/login", LoginController.login);
        r.post("/logout", LoginController.logout);
    })
);

router.use(
    "/",
    routerGroup((r: Router) => {
        r.use(authMiddleware);

        r.get("/gdpr", GDPRController.getData);
        r.get("/notifications", UserNotificationController.getUnreadNotifications);

        r.use(
            "/course",
            routerGroup((r: Router) => {
                r.get("/", CourseController.getAll);
                r.get("/my", UserCourseController.getMyCourses);
                r.get("/available", UserCourseController.getAvailableCourses);
                r.get("/active", UserCourseController.getActiveCourses);
                r.put("/enrol", UserCourseController.enrolInCourse);

                r.get("/info", CourseInformationController.getInformationByUUID);
                r.get("/info/my", CourseInformationController.getUserCourseInformationByUUID);
                r.get("/info/training", CourseInformationController.getCourseTrainingInformationByUUID);
            })
        );

        r.use(
            "/user-info",
            routerGroup((r: Router) => {
                r.get("/training-request", UserTrainingController.getRequests);
                r.get("/training-request/:course_uuid", UserTrainingController.getRequestsByUUID);

                r.get("/mentor-group", UserMentorGroupController.getMentorGroups);
                r.get("/mentor-group/cm", UserMentorGroupController.getCourseManagerMentorGroups);
            })
        );

        r.use(
            "/training-request",
            routerGroup((r: Router) => {
                r.post("/", TrainingRequestController.create);
                r.delete("/", TrainingRequestController.destroy);

                r.get("/open", TrainingRequestController.getOpen);
                r.get("/planned", TrainingRequestController.getPlanned);
                r.get("/:request_uuid", TrainingRequestController.getByUUID);
            })
        );

        r.use(
            "/training-type",
            routerGroup((r: Router) => {
                r.get("/:id", TrainingTypeController.getByID);
            })
        );
    })
);

router.use(
    "/administration",
    routerGroup((r: Router) => {
        r.use(
            "/user",
            routerGroup((r: Router) => {
                r.get("/data/", UserInformationAdminController.getUserDataByID);
                r.get("/data/sensitive", UserInformationAdminController.getSensitiveUserDataByID);

                r.get("/notes", UserNoteAdminController.getGeneralUserNotes);

                r.get("/", UserController.getAll);
                r.get("/min", UserController.getAllUsersMinimalData);
                r.get("/sensitive", UserController.getAllSensitive);
            })
        );

        r.use(
            "/training-request",
            routerGroup((r: Router) => {
                r.get("/", TrainingRequestAdminController.getOpen);
                r.get("/training", TrainingRequestAdminController.getOpenTrainingRequests);
                r.get("/lesson", TrainingRequestAdminController.getOpenLessonRequests);
                r.get("/:uuid", TrainingRequestAdminController.getByUUID);
                r.delete("/:uuid", TrainingRequestAdminController.destroyByUUID);
            })
        );

        r.use(
            "/training-session",
            routerGroup((r: Router) => {
                r.put("/training", TrainingSessionAdminController.createTrainingSession);
                // TODO r.put("/lesson");
            })
        );

        r.use(
            "/course",
            routerGroup((r: Router) => {
                r.get("/", CourseAdministrationController.getAll);
                r.put("/", CourseAdministrationController.create);

                r.get("/editable", CourseAdministrationController.getEditable);

                r.get("/info/", CourseInformationAdministrationController.getByUUID);
                r.get("/info/mentor-group", CourseInformationAdministrationController.getMentorGroups);

                r.get("/info/user", CourseInformationAdministrationController.getUsers);
                r.patch("/info/update", CourseInformationAdministrationController.update);
                r.delete("/info/user", CourseInformationAdministrationController.deleteUser);
                r.delete("/info/mentor-group", CourseInformationAdministrationController.deleteMentorGroup);
            })
        );

        r.use(
            "/course-skill-template",
            routerGroup((r: Router) => {
                r.get("/", SkillTemplateAdministrationController.getAll);
            })
        );

        r.use(
            "/training-type",
            routerGroup((r: Router) => {
                r.get("/", TrainingTypeAdministrationController.getAll);
                r.put("/", TrainingTypeAdministrationController.create);

                r.get("/:id", TrainingTypeAdministrationController.getByID);
                r.patch("/:id", TrainingTypeAdministrationController.update);

                r.put("/station", TrainingTypeAdministrationController.addStation);
                r.delete("/station", TrainingTypeAdministrationController.removeStation);
            })
        );

        r.use(
            "/fast-track",
            routerGroup((r: Router) => {
                r.post("/", FastTrackAdministrationController.create);
                r.get("/user", FastTrackAdministrationController.getByUserID);
            })
        );

        r.use(
            "/training-log",
            routerGroup((r: Router) => {
                r.get("/template/", LogTemplateAdministrationController.getAll);
                r.put("/template/", LogTemplateAdministrationController.create);

                r.get("/template/min", LogTemplateAdministrationController.getAllMinimalData);
            })
        );

        r.use(
            "/mentor-group",
            routerGroup((r: Router) => {
                r.post("/", MentorGroupAdministrationController.create);

                r.get("/admin", MentorGroupAdministrationController.getAllAdmin);

                r.get("/course-manager", MentorGroupAdministrationController.getAllCourseManager);

                r.get("/:mentor_group_id", MentorGroupAdministrationController.getByID);
            })
        );

        r.use(
            "/training-station",
            routerGroup((r: Router) => {
                r.get("/", async (request, response) => {
                    const d = await TrainingStation.findAll();
                    // TODO: move to controller
                    response.send(d);
                });
            })
        );

        r.use(
            "/syslog",
            routerGroup((r: Router) => {
                r.get("/", SyslogAdminController.getAll);
                r.get("/:id", SyslogAdminController.getInformationByID);
            })
        );

        r.use(
            "/permission",
            routerGroup((r: Router) => {
                r.get("/", PermissionAdministrationController.getAll);
                r.put("/", PermissionAdministrationController.create);
                r.delete("/", PermissionAdministrationController.destroy);
            })
        );

        r.use(
            "/role",
            routerGroup((r: Router) => {
                r.get("/", RoleAdministrationController.getAll);
                r.get("/:role_id", RoleAdministrationController.getByID);
                r.patch("/:role_id", RoleAdministrationController.update);

                r.put("/perm/:role_id", RoleAdministrationController.addPermission);
                r.delete("/perm/:role_id", RoleAdministrationController.removePermission);
            })
        );
    })
);
