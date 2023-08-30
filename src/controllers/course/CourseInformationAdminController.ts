import { Course } from "../../models/Course";
import { Request, Response } from "express";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { MentorGroup } from "../../models/MentorGroup";
import { ValidatorType } from "../_validators/ValidatorType";
import { TrainingRequest } from "../../models/TrainingRequest";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import ValidationHelper from "../../utility/helper/ValidationHelper";
import _CourseInformationAdminValidator from "./_CourseInformationAdmin.validator";

/**
 * Gets the basic course information associated with this course
 */
async function getByUUID(request: Request, response: Response) {
    const uuid: string | undefined = request.query.uuid?.toString();

    if (uuid == null) {
        response.status(404).send({ error: 'Missing required parameter "course_uuid"' });
        return;
    }

    const course: Course | null = await Course.findOne({
        where: {
            uuid: uuid,
        },
        include: [Course.associations.training_type, Course.associations.skill_template],
    });

    response.send(course);
}

/**
 * Gets all mentor groups associated with this course
 * @param request
 * @param response
 */
async function getMentorGroups(request: Request, response: Response) {
    const validation: ValidatorType = _CourseInformationAdminValidator.validateGetMentorGroupsRequest(request.query.uuid);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const course: Course | null = await Course.findOne({
        where: {
            uuid: request.query.uuid?.toString(),
        },
        include: [
            {
                association: Course.associations.mentor_groups,
                through: {
                    attributes: ["can_edit_course", "createdAt"],
                },
                include: [
                    {
                        association: MentorGroup.associations.users,
                        attributes: ["first_name", "last_name", "id"],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
        ],
    });

    response.send(course?.mentor_groups ?? []);
}

/**
 * Delete mentor group from course with mentor_group_id and course_uuid
 * @param request
 * @param response
 */
async function deleteMentorGroup(request: Request, response: Response) {
    const validation: ValidatorType = _CourseInformationAdminValidator.validateDeleteMentorGroupRequest(request.body.data);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    await MentorGroupsBelongsToCourses.destroy({
        where: {
            course_id: request.body?.data?.course_id?.toString(),
            mentor_group_id: request.body?.data?.mentor_group_id,
        },
    });

    response.send({ message: "OK" });
}

/**
 * Gets the users associated to a course with the specific course_uuid
 * If no user is part of this course, or the course wasn't found, returns an empty array.
 */
async function getUsers(request: Request, response: Response) {
    const uuid: string | undefined = request.query?.uuid?.toString();

    const validation: ValidatorType = _CourseInformationAdminValidator.validateGetUsersRequest(uuid);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const course = await Course.findOne({
        where: {
            uuid: uuid,
        },
        include: [
            {
                association: Course.associations.users,
            },
        ],
    });

    response.send(course?.users ?? []);
}

/**
 * Removes a user from a course including all associated training requests
 * @param request
 * @param response
 */
async function deleteUser(request: Request, response: Response) {
    const body = request.body as { course_uuid: string; user_id: number };

    const validation = _CourseInformationAdminValidator.validateDeleteUserRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    const course = await Course.findOne({
        where: {
            uuid: body.course_uuid,
        },
    });

    if (course == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    await UsersBelongsToCourses.destroy({
        where: {
            user_id: body.user_id,
            course_id: course.id,
        },
    });

    await TrainingRequest.destroy({
        where: {
            user_id: body.user_id,
            course_id: course.id,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Updates the course's information
 */
async function updateCourse(request: Request, response: Response) {
    const body = request.body as {
        course_uuid: string;
        active: boolean;
        self_enrol_enabled: boolean;
        description_de: string;
        description_en: string;
        name_de: string;
        name_en: string;
        training_type_id: string;
        skill_template_id?: string;
    };

    // const validation: ValidatorType = _CourseInformationAdminValidator.validateUpdateOrCreateRequest(body);
    // if (validation.invalid) {
    //     ValidationHelper.sendValidationErrorResponse(response, validation);
    //     return;
    // }

    const updateObject = {
        name: body.name_de,
        name_en: body.name_en,
        description: body.description_de,
        description_en: body.description_en,
        is_active: body.active,
        self_enrollment_enabled: body.self_enrol_enabled,
        initial_training_type: Number(body.training_type_id),
        skill_template_id: body.skill_template_id != null && !isNaN(Number(body.skill_template_id)) ? Number(body.skill_template_id) : null,
    };

    await Course.update(updateObject, {
        where: {
            uuid: body.course_uuid,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

async function addMentorGroup(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { mentor_group_id: number; course_id: number; can_edit: boolean };

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: body.mentor_group_id,
        course_id: body.course_id,
        can_edit_course: body.can_edit,
    });

    response.sendStatus(HttpStatusCode.Created);
}

export default {
    getByUUID,
    getMentorGroups,
    addMentorGroup,
    deleteMentorGroup,
    getUsers,
    deleteUser,
    updateCourse,
};
