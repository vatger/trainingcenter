import { Request, Response, Router } from "express";
import SkillTemplateAdministrationController from "../../../controllers/skill-template/SkillTemplate.admin.controller";

// Path: "/administration/course-skill-template"
export const CourseSkillTemplateAdminRouter: Router = Router();

CourseSkillTemplateAdminRouter.get("/", SkillTemplateAdministrationController.getAll);
