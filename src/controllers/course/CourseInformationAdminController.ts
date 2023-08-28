import { Course } from "../../models/Course";
import { Request, Response } from "express";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { MentorGroup } from "../../models/MentorGroup";
import CourseInformationAdminValidator from "../_validators/CourseInformationAdminValidator";
import { ValidatorType } from "../_validators/ValidatorType";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSession } from "../../models/TrainingSession";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";

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
    const validation: ValidatorType = CourseInformationAdminValidator.validateGetMentorGroupsRequest(request.query.uuid);
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
    const validation: ValidatorType = CourseInformationAdminValidator.validateDeleteMentorGroupRequest(request.body.data);
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

    const validation: ValidatorType = CourseInformationAdminValidator.validateGetUsersRequest(uuid);
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

async function deleteUser(request: Request, response: Response) {
    const requestData = request.body.data;

    const validation: ValidatorType = CourseInformationAdminValidator.validateDeleteUserRequest(requestData);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    await UsersBelongsToCourses.destroy({
        where: {
            user_id: requestData.user_id,
            course_id: requestData.course_id,
        },
    });

    await TrainingRequest.destroy({
        where: {
            user_id: requestData.user_id,
            course_id: requestData.course_id,
        },
    });

    response.send({ message: "OK" });
}

/**
 * Updates the course's information
 */
async function update(request: Request, response: Response) {
    const data = request.body.data;

    const validation: ValidatorType = CourseInformationAdminValidator.validateUpdateRequest(data);
    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const updateObject = {
        name: data.name_de,
        name_en: data.name_en,
        description: data.description_de,
        description_en: data.description_en,
        is_active: Number(data.active) == 1,
        self_enrollment_enabled: Number(data.self_enrol) == 1,
        initial_training_type: Number(data.training_id),
        skill_template_id: Number(data.skill_template_id) == 0 || isNaN(Number(data.skill_template_id)) ? null : data.skill_template_id,
    };

    await Course.update(updateObject, {
        where: {
            uuid: data.course_uuid,
        },
    });

    const course: Course | null = await Course.findOne({
        where: {
            uuid: data.course_uuid,
        },
        include: [Course.associations.training_type, Course.associations.skill_template],
    });

    if (course == null) {
        response.status(500).send();
        return;
    }

    response.send(course);
}

async function addMentorGroup(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as {mentor_group_id: number; course_id: number; can_edit: boolean};

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: body.mentor_group_id,
        course_id: body.course_id,
        can_edit_course: body.can_edit
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
    update,
};
