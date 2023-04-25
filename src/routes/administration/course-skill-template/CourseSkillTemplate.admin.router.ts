import { Request, Response, Router } from "express";
import SkillTemplateAdministrationController from "../../../controllers/skill-template/SkillTemplate.admin.controller";

// Path: "/administration/course-skill-template"
export const CourseSkillTemplateAdminRouter = Router();

CourseSkillTemplateAdminRouter.get("/", async (request: Request, response: Response) => {
    await SkillTemplateAdministrationController.getAll(request, response);
});
