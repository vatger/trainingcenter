import { Request, Response } from "express";
import { CourseSkillTemplate } from "../../models/CourseSkillTemplate";

/**
 * Gets all skill templates
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const trainingTypes = await CourseSkillTemplate.findAll();
    response.send(trainingTypes);
}

export default {
    getAll,
};
