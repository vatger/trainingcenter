import { Router } from "express";
import { CourseAdminRouter } from "./course/Course.admin.router";
import { SyslogAdminRouter } from "./syslog/Syslog.admin.router";
import { CourseSkillTemplateAdminRouter } from "./course-skill-template/CourseSkillTemplate.admin.router";
import { TrainingTypeAdminRouter } from "./training-type/TrainingType.admin.router";
import { UserAdminRouter } from "./user/User.admin.router";
import { PermissionAdminRouter } from "./permission/Permission.admin.router";
import { FastTrackAdminRouter } from "./fast-track/FastTrack.admin.router";
import { TrainingLogAdminRouter } from "./training-log/TrainingLog.admin.router";
import { MentorGroupAdminRouter } from "./mentor-group/MentorGroup.admin.router";
import { RoleAdminRouter } from "./permission/Role.admin.router";
import { TrainingRequestAdminRouter } from "./training-request/TrainingRequest.admin.router";
import { TrainingStationAdminRouter } from "./training-station/TrainingStation.admin.router";

// Path: "/administration"
export const AdministrationRouter = Router();

/*
    ADMINISTRATION > MENTOR
*/
AdministrationRouter.use("/user", UserAdminRouter);
AdministrationRouter.use("/training-request", TrainingRequestAdminRouter);

/*
    ADMINISTRATION > LM
*/
AdministrationRouter.use("/course", CourseAdminRouter);
AdministrationRouter.use("/course-skill-template", CourseSkillTemplateAdminRouter);
AdministrationRouter.use("/training-type", TrainingTypeAdminRouter);
AdministrationRouter.use("/fast-track", FastTrackAdminRouter);
AdministrationRouter.use("/training-log", TrainingLogAdminRouter);
AdministrationRouter.use("/mentor-group", MentorGroupAdminRouter);

/*
    ADMINISTRATION > ATD Prüfer
*/

/*
    ADMINISTRATION > ATD
*/
AdministrationRouter.use("/training-station", TrainingStationAdminRouter);

/*
    ADMINISTRATION > TECH
*/
AdministrationRouter.use("/syslog", SyslogAdminRouter);
AdministrationRouter.use("/permission", PermissionAdminRouter);
AdministrationRouter.use("/role", RoleAdminRouter);
