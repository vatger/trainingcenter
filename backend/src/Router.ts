import { Router } from "express";
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
import TrainingTypeAdministrationController from "./controllers/training-type/TrainingTypeAdminController";
import FastTrackAdministrationController from "./controllers/fast-track/FastTrackAdminController";
import LogTemplateAdministrationController from "./controllers/log-template/LogTemplateAdminController";
import MentorGroupAdministrationController from "./controllers/mentor-group/MentorGroupAdminController";
import PermissionAdministrationController from "./controllers/permission/PermissionAdminController";
import RoleAdministrationController from "./controllers/permission/RoleAdminController";
import UserNotificationController from "./controllers/user/UserNotificationController";
import TrainingSessionAdminController from "./controllers/training-session/TrainingSessionAdminController";
import TrainingSessionController from "./controllers/training-session/TrainingSessionController";
import UserCourseAdminController from "./controllers/user/UserCourseAdminController";
import SessionController from "./controllers/login/SessionController";
import UserSettingsController from "./controllers/user/UserSettingsController";
import CourseAdministrationController from "./controllers/course/CourseAdministrationController";
import TrainingStationAdminController from "./controllers/training-station/TrainingStationAdminController";
import TrainingLogController from "./controllers/training-log/TrainingLogController";
import ActionRequirementAdministrationController from "./controllers/action-requirement/ActionRequirementAdministrationController";
import EndorsementGroupAdminController from "./controllers/endorsement-group/EndorsementGroupAdminController";
import UserCourseProgressAdministrationController from "./controllers/user-course-progress/UserCourseProgressAdministrationController";
import SoloAdminController from "./controllers/solo/SoloAdminController";
import UserEndorsementAdminController from "./controllers/user/UserEndorsementAdminController";
import UserStatisticsController from "./controllers/user/UserStatisticsController";
import SyslogAdminController from "./controllers/admin-logs/SyslogAdminController";
import JoblogAdminController from "./controllers/admin-logs/JoblogAdminController";
import UserInformationController from "./controllers/user/UserInformationController";

export const routerGroup = (callback: (router: Router) => void) => {
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

        r.get("/user/update", LoginController.updateUserData);
        r.patch("/settings", UserSettingsController.updateSettings);

        r.get("/sessions", SessionController.getUserSessions);
        r.delete("/session", SessionController.deleteUserSession);

        r.get("/overview", UserInformationController.getOverviewStatistics);

        r.get("/gdpr", GDPRController.getData);

        r.use(
            "/statistics",
            routerGroup((r: Router) => {
                r.get("/rating-times", UserStatisticsController.getUserRatingTimes);
                r.get("/training-session-count", UserStatisticsController.getUserTrainingSessionCount);
            })
        );

        r.use(
            "/notification",
            routerGroup((r: Router) => {
                r.get("/", UserNotificationController.getNotifications);
                r.delete("/", UserNotificationController.deleteNotification);

                r.get("/unread", UserNotificationController.getUnreadNotifications);

                r.post("/toggle", UserNotificationController.toggleMarkNotificationRead);
                r.post("/read", UserNotificationController.markNotificationRead);
                r.post("/read/all", UserNotificationController.markAllNotificationsRead);
            })
        );

        r.use(
            "/course",
            routerGroup((r: Router) => {
                r.get("/", CourseController.getAll);
                r.get("/my", UserCourseController.getMyCourses);
                r.get("/available", UserCourseController.getAvailableCourses);
                r.get("/active", UserCourseController.getActiveCourses);
                r.put("/enrol", UserCourseController.enrolInCourse);
                r.get("/completed", UserCourseController.getCompletedCourses);
                r.delete("/withdraw", UserCourseController.withdrawFromCourseByUUID);

                r.get("/info", CourseInformationController.getInformationByUUID);
                r.get("/info/my", CourseInformationController.getUserCourseInformationByUUID);
                r.get("/info/training", CourseInformationController.getCourseTrainingInformationByUUID);
                r.get("/info/requirements/validate", CourseInformationController.validateCourseRequirements);
            })
        );

        r.use(
            "/training-log",
            routerGroup((r: Router) => {
                r.get("/:uuid", TrainingLogController.getByUUID);
            })
        );

        r.use(
            "/user-info",
            routerGroup((r: Router) => {
                r.get("/training-request", UserTrainingController.getRequests);
                r.get("/training-request/:course_uuid", UserTrainingController.getRequestsByUUID);
                r.get("/training-request/:course_uuid/active", UserTrainingController.getActiveRequestsByUUID);

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

                r.post("/confirm-interest", TrainingRequestController.confirmInterest);
            })
        );

        r.use(
            "/training-session",
            routerGroup((r: Router) => {
                r.get("/upcoming", TrainingSessionController.getUpcoming);
                r.get("/completed", TrainingSessionController.getCompleted);
                r.get("/:uuid", TrainingSessionController.getByUUID);
                r.delete("/withdraw/:uuid", TrainingSessionController.withdrawFromSessionByUUID);
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
                r.get("/data/basic", UserInformationAdminController.getBasicUserDataByID);
                r.get("/data/sensitive", UserInformationAdminController.getSensitiveUserDataByID);

                r.post("/note", UserNoteAdminController.createUserNote);
                r.get("/notes", UserNoteAdminController.getGeneralUserNotes);
                r.get("/notes/course", UserNoteAdminController.getNotesByCourseID);

                r.get("/", UserController.getAll);
                r.get("/min", UserController.getAllUsersMinimalData);
                r.get("/sensitive", UserController.getAllSensitive);

                r.get("/course/match", UserCourseAdminController.getUserCourseMatch);
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
                r.get("/planned", TrainingSessionAdminController.getPlanned);
                r.get("/all-upcoming", TrainingSessionAdminController.getAllUpcoming);
                r.post("/training", TrainingSessionAdminController.createTrainingSession);
                r.get("/my", TrainingSessionAdminController.getMyTrainingSessions);
                r.delete("/training", TrainingSessionAdminController.deleteTrainingSession);
                r.get("/:uuid", TrainingSessionAdminController.getByUUID);
                r.patch("/:uuid", TrainingSessionAdminController.updateByUUID);
                r.get("/:uuid/mentors", TrainingSessionAdminController.getAvailableMentorsByUUID);

                r.get("/training-types/:uuid", TrainingSessionAdminController.getCourseTrainingTypes);
                r.get("/log-template/:uuid", TrainingSessionAdminController.getLogTemplate);
                r.get("/participants/:uuid", TrainingSessionAdminController.getParticipants);

                r.post("/log/:uuid", TrainingSessionAdminController.createTrainingLogs);
            })
        );

        r.use(
            "/endorsement-group",
            routerGroup((r: Router) => {
                r.get("/mentorable", EndorsementGroupAdminController.getMentorable);

                r.get("/", EndorsementGroupAdminController.getAll);
                r.get("/with-stations", EndorsementGroupAdminController.getAllWithStations);
                r.post("/", EndorsementGroupAdminController.createEndorsementGroup);

                r.get("/:id", EndorsementGroupAdminController.getByID);
                r.patch("/:id", EndorsementGroupAdminController.updateByID);
                r.delete("/:id", EndorsementGroupAdminController.deleteByID);

                r.get("/:id/stations", EndorsementGroupAdminController.getStationsByID);
                r.put("/:id/stations", EndorsementGroupAdminController.addStationByID);
                r.delete("/:id/stations", EndorsementGroupAdminController.removeStationByID);

                r.get("/:id/users", EndorsementGroupAdminController.getUsersByID);
                r.delete("/:id/users", EndorsementGroupAdminController.removeUserByID);
            })
        );

        r.use(
            "/course",
            routerGroup((r: Router) => {
                r.get("/mentorable", CourseAdministrationController.getMentorable);
                r.get("/editable", CourseAdministrationController.getEditable);
                // -----------------------

                r.get("/", CourseAdministrationController.getAllCourses);
                r.post("/", CourseAdministrationController.createCourse);
                r.patch("/", CourseAdministrationController.updateCourse);
                r.get("/:course_uuid", CourseAdministrationController.getCourse);

                r.get("/user/:course_uuid", CourseAdministrationController.getCourseParticipants);
                r.delete("/user/:course_uuid", CourseAdministrationController.removeCourseParticipant);

                r.get("/mentor-group/:course_uuid", CourseAdministrationController.getCourseMentorGroups);
                r.post("/mentor-group/:course_uuid", CourseAdministrationController.addMentorGroupToCourse);
                r.delete("/mentor-group/:course_uuid", CourseAdministrationController.removeMentorGroupFromCourse);

                r.get("/training-type/:course_uuid", CourseAdministrationController.getCourseTrainingTypes);
                r.post("/training-type/:course_uuid", CourseAdministrationController.addCourseTrainingType);
                r.delete("/training-type/:course_uuid", CourseAdministrationController.removeCourseTrainingType);
            })
        );

        r.use(
            "/user-course-progress",
            routerGroup((r: Router) => {
                r.get("/", UserCourseProgressAdministrationController.getInformation);
                r.patch("/", UserCourseProgressAdministrationController.updateInformation);
            })
        );

        r.use(
            "/training-type",
            routerGroup((r: Router) => {
                r.get("/", TrainingTypeAdministrationController.getAll);
                r.post("/", TrainingTypeAdministrationController.create);

                r.get("/:id", TrainingTypeAdministrationController.getByID);
                r.patch("/:id", TrainingTypeAdministrationController.update);

                r.put("/station", TrainingTypeAdministrationController.addStation);
                r.delete("/station", TrainingTypeAdministrationController.removeStation);
            })
        );

        r.use(
            "/fast-track",
            routerGroup((r: Router) => {
                r.get("/", FastTrackAdministrationController.getAll);
                r.post("/", FastTrackAdministrationController.create);
                r.get("/user", FastTrackAdministrationController.getByUserID);
                r.get("/pending", FastTrackAdministrationController.getAllPending);
                r.get("/attachment/:id", FastTrackAdministrationController.getAttachmentByID);

                r.get("/:id", FastTrackAdministrationController.getByID);
                r.patch("/:id", FastTrackAdministrationController.updateByID);
            })
        );

        r.use(
            "/training-log",
            routerGroup((r: Router) => {
                r.get("/template", LogTemplateAdministrationController.getAll);
                r.post("/template", LogTemplateAdministrationController.create);
                r.get("/template/min", LogTemplateAdministrationController.getAllMinimalData);

                r.get("/template/:id", LogTemplateAdministrationController.getByID);
                r.patch("/template/:id", LogTemplateAdministrationController.update);
                r.delete("/template/:id", LogTemplateAdministrationController.destroy);
            })
        );

        r.use(
            "/endorsement",
            routerGroup((r: Router) => {
                r.post("/", UserEndorsementAdminController.addEndorsement);
            })
        );

        r.use(
            "/solo",
            routerGroup((r: Router) => {
                r.post("/", SoloAdminController.createSolo);
                r.patch("/", SoloAdminController.updateSolo);
                r.delete("/", SoloAdminController.deleteSolo);

                r.post("/extend", SoloAdminController.extendSolo);
            })
        );

        r.use(
            "/mentor-group",
            routerGroup((r: Router) => {
                r.get("/", MentorGroupAdministrationController.getAll);
                r.post("/", MentorGroupAdministrationController.create);
                r.patch("/", MentorGroupAdministrationController.update);

                r.get("/admin", MentorGroupAdministrationController.getAllAdmin);
                r.get("/members", MentorGroupAdministrationController.getMembers);
                r.put("/member", MentorGroupAdministrationController.addMember);
                r.delete("/member", MentorGroupAdministrationController.removeMember);

                r.get("/course-manager", MentorGroupAdministrationController.getAllCourseManager);

                r.post("/endorsement-group", MentorGroupAdministrationController.addEndorsementGroupByID);

                r.get("/:mentor_group_id", MentorGroupAdministrationController.getByID);
                r.get("/:mentor_group_id/endorsement-group", MentorGroupAdministrationController.getEndorsementGroupsByID);
            })
        );

        r.use(
            "/training-station",
            routerGroup((r: Router) => {
                r.get("/", TrainingStationAdminController.getAll);
                r.get("/:id", TrainingStationAdminController.getByID);

                r.post("/sync", TrainingStationAdminController.syncStations);
            })
        );

        r.use(
            "/action-requirement",
            routerGroup((r: Router) => {
                r.get("/", ActionRequirementAdministrationController.getAll);
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
            "/joblog",
            routerGroup((r: Router) => {
                r.get("/", JoblogAdminController.getAll);
                r.get("/:id", JoblogAdminController.getInformationByID);
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
                r.post("/", RoleAdministrationController.create);
                r.post("/user", RoleAdministrationController.addUser);
                r.delete("/user", RoleAdministrationController.removeUser);
                r.get("/:role_id", RoleAdministrationController.getByID);
                r.patch("/:role_id", RoleAdministrationController.update);

                r.put("/perm/:role_id", RoleAdministrationController.addPermission);
                r.delete("/perm/:role_id", RoleAdministrationController.removePermission);
            })
        );
    })
);