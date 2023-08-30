import { Request, Response } from "express";
import { User } from "../../models/User";
import _CourseAdministrationValidator from "./_CourseAdministration.validator";
import ValidationHelper from "../../utility/helper/ValidationHelper";
import { Course } from "../../models/Course";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { HttpStatusCode } from "axios";

// TODO: Move all course related things into this controller

/**
 * The ICourseBody Interface is the type which all requests that wish to create or update a course must satisfy
 */
interface ICourseBody {
    course_uuid: string;
    name_de: string;
    name_en: string;
    description_de: string;
    description_en: string;
    active: boolean;
    self_enrol_enabled: boolean;
    training_type_id: string;
    mentor_group_id: string;
    skill_template_id?: string;
}

/**
 * Validates and creates a new course based on the request
 * @param request
 * @param response
 */
async function createCourse(request: Request, response: Response) {
    const user: User = request.body.user;
    const body: ICourseBody = request.body as ICourseBody;

    const validation = _CourseAdministrationValidator.validateUpdateOrCreateRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    if (!user.hasPermission("course.create") || !(await user.canManageCourseInMentorGroup(Number(body.mentor_group_id)))) {
        response.sendStatus(HttpStatusCode.Forbidden);
        return;
    }

    const skillTemplateID = isNaN(Number(body.skill_template_id)) || body.skill_template_id == "-1" ? null : Number(body.skill_template_id);
    const course = await Course.create({
        uuid: body.course_uuid,
        name: body.name_de,
        name_en: body.name_en,
        description: body.description_de,
        description_en: body.description_en,
        is_active: body.active,
        self_enrollment_enabled: body.self_enrol_enabled,
        initial_training_type: Number(body.training_type_id),
        skill_template_id: skillTemplateID,
    });

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: Number(body.mentor_group_id),
        course_id: course.id,
        can_edit_course: true,
    });

    response.status(HttpStatusCode.Created).send({ uuid: course.uuid });
}

/**
 * Validates and updates a course based on the request
 * @param request
 * @param response
 */
async function updateCourse(request: Request, response: Response) {
    const user: User = request.body.user;
    const body: ICourseBody = request.body as ICourseBody;

    const validation = _CourseAdministrationValidator.validateUpdateOrCreateRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    if (!(await user.canEditCourse(body.course_uuid))) {
        response.sendStatus(HttpStatusCode.Forbidden);
        return;
    }

    const skillTemplateID = isNaN(Number(body.skill_template_id)) || body.skill_template_id == "-1" ? null : Number(body.skill_template_id);
    await Course.update(
        {
            name: body.name_de,
            name_en: body.name_en,
            description: body.description_de,
            description_en: body.description_en,
            is_active: body.active,
            self_enrollment_enabled: body.self_enrol_enabled,
            initial_training_type: Number(body.training_type_id),
            skill_template_id: skillTemplateID,
        },
        {
            where: {
                uuid: body.course_uuid,
            },
        }
    );

    response.sendStatus(HttpStatusCode.NoContent);
}

export default {
    createCourse,
    updateCourse,
};
