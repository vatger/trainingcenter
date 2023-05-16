import { Course } from "../../models/Course";
import { Request, Response } from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { MentorGroup } from "../../models/MentorGroup";

/**
 * Gets the basic course information associated with this course
 */
async function getByUUID(request: Request, response: Response) {
    const uuid = request.query.uuid?.toString();

    if (uuid == null) {
        response.status(404).send({ error: 'Missing required parameter "course_uuid"' });
        return;
    }

    const course = await Course.findOne({
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
    const course_uuid = request.query.uuid;

    const validation = ValidationHelper.validate([
        {
            name: "uuid",
            validationObject: course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const course = await Course.findOne({
        where: {
            uuid: course_uuid?.toString(),
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
    const course_id = request.body?.data?.course_id;
    const mentor_group_id = request.body?.data?.mentor_group_id;

    console.log(request.body);
    console.log(request.params);
    console.log(request.query);

    const validation = ValidationHelper.validate([
        {
            name: "course_id",
            validationObject: course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "mentor_group_id",
            validationObject: mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    console.log(course_id, mentor_group_id);

    await MentorGroupsBelongsToCourses.destroy({
        where: {
            course_id: course_id?.toString(),
            mentor_group_id: mentor_group_id,
        },
    });

    response.send({ message: "OK" });
}

/**
 * Gets the users associated to a course with the specific course_uuid
 * If no user is part of this course, or the course wasn't found, returns an empty array.
 */
async function getUsers(request: Request, response: Response) {
    const uuid = request.query?.uuid?.toString();

    const validation = ValidationHelper.validate([
        {
            name: "uuid",
            validationObject: uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

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

    const validation = ValidationHelper.validate([
        {
            name: "course_id",
            validationObject: requestData.course_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "user_id",
            validationObject: requestData.user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

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

    response.send({ message: "OK" });
}

/**
 * Updates the course's information
 */
async function update(request: Request, response: Response) {
    const data = request.body.data;
    const course_uuid = data.course_uuid;

    const validation = ValidationHelper.validate([
        {
            name: "course_uuid",
            validationObject: course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "name_de",
            validationObject: data.name_de,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "name_en",
            validationObject: data.name_en,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "description_de",
            validationObject: data.description_de,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "description_en",
            validationObject: data.description_en,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "self_enrol",
            validationObject: data.self_enrol,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "active",
            validationObject: data.active,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "training_id",
            validationObject: data.training_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
        },
    ]);

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

    try {
        await Course.update(updateObject, {
            where: {
                uuid: course_uuid,
            },
        });

        response.send({ message: "OK" });
    } catch (e: any) {
        response.status(500).send({ message: e.message });
    }
}

export default {
    getByUUID,
    getMentorGroups,
    deleteMentorGroup,
    getUsers,
    deleteUser,
    update,
};
