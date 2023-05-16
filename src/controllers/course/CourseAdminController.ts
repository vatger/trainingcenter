import { Request, Response } from "express";
import { Course } from "../../models/Course";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";

/**
 * Gets all courses
 */
async function getAll(request: Request, response: Response) {
    const courses = await Course.findAll();

    response.send(courses);
}

/**
 * Gets the courses that the user can actively edit
 * These are all courses associated to a user through their respective
 * mentor groups, where admin = true!
 */
async function getEditable(request: Request, response: Response) {
    const reqUser: User = request.body.user;

    const user = await User.findOne({
        where: {
            id: reqUser.id,
        },
        include: {
            association: User.associations.mentor_groups,
            through: {
                where: {
                    can_manage_course: true,
                },
                attributes: [],
            },
            include: [
                {
                    association: MentorGroup.associations.courses,
                    through: {
                        where: {
                            can_edit_course: true,
                        },
                        attributes: [],
                    },
                },
            ],
        },
    });
    if (user == null) {
        response.status(500).send({ message: "User not found" });
        return;
    }

    let courses: Course[] = [];
    for (const mentorGroup of user?.mentor_groups ?? []) {
        for (const course of mentorGroup.courses ?? []) {
            courses.push(course);
        }
    }

    response.send(courses);
}

/**
 * Creates a new course
 */
async function create(request: Request, response: Response) {
    const data = request.body.data;
    const course_uuid = data.course_uuid;

    const validation = ValidationHelper.validate([
        {
            name: "course_uuid",
            validationObject: course_uuid,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
        {
            name: "mentor_group_id",
            validationObject: data.mentor_group_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
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
            toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }, { val: ValidationOptions.NOT_EQUAL_NUM, value: 0 }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const createObject = {
        uuid: course_uuid,
        name: data.name_de,
        name_en: data.name_en,
        description: data.description_de,
        description_en: data.description_en,
        is_active: Number(data.active) == 1,
        self_enrollment_enabled: Number(data.self_enrol) == 1,
        initial_training_type: Number(data.training_id),
        skill_template_id: Number(data.skill_template_id) == 0 || isNaN(Number(data.skill_template_id)) ? null : data.skill_template_id,
    };

    const course = await Course.create(createObject);
    if (course == null) {
        response.status(500).send({ error: "An error occured creating the course" });
        return;
    }

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: Number(data.mentor_group_id),
        course_id: course.id,
        can_edit_course: true,
    });

    response.send(course);
}

export default {
    create,
    getAll,
    getEditable,
};
