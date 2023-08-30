import { Request, Response } from "express";
import { Course } from "../../models/Course";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import CourseAdminValidator from "../_validators/CourseAdminValidator";
import { ValidatorType } from "../_validators/ValidatorType";
import { HttpStatusCode } from "axios";
import { TrainingType } from "../../models/TrainingType";
import _CourseInformationAdminValidator from "./_CourseInformationAdmin.validator";

// DEPRECATED
// TODO REMOVE THIS CONTROLLER --> CourseAdministrationController

/**
 * Gets all courses
 */
async function getAll(request: Request, response: Response) {
    const courses: Course[] = await Course.findAll();

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
    const user = request.body.user;
    const data = request.body as {
        course_uuid: string;
        name_de: string;
        name_en: string;
        description_de: string;
        description_en: string;
        active: boolean;
        self_enrol_enabled: boolean;
        training_type_id: string;
        skill_template_id: string;
        mentor_group_id: string;
    };

    // const validation: ValidatorType = _CourseInformationAdminValidator.validateUpdateOrCreateRequest(data);
    //
    // if (validation.invalid) {
    //     response.status(HttpStatusCode.BadRequest).send({
    //         validation: validation.message,
    //         validation_failed: true,
    //     });
    //     return;
    // }

    const course: Course = await Course.create({
        uuid: data.course_uuid,
        name: data.name_de,
        name_en: data.name_en,
        description: data.description_de,
        description_en: data.description_en,
        is_active: data.active,
        self_enrollment_enabled: data.self_enrol_enabled,
        initial_training_type: Number(data.training_type_id),
        skill_template_id: Number(data.skill_template_id) == 0 || isNaN(Number(data.skill_template_id)) ? null : Number(data.skill_template_id),
    });
    if (course == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: Number(data.mentor_group_id),
        course_id: course.id,
        can_edit_course: true,
    });

    response.send(course);
}

async function getMentorable(request: Request, response: Response) {
    const user: User = request.body.user;

    const userWithCourses = await User.findOne({
        where: {
            id: user.id,
        },
        include: [
            {
                association: User.associations.mentor_groups,
                through: { attributes: [] },
                include: [
                    {
                        association: MentorGroup.associations.courses,
                        through: { attributes: [] },
                        include: [
                            {
                                association: Course.associations.training_types,
                                through: { attributes: [] },
                                include: [
                                    {
                                        association: TrainingType.associations.training_stations,
                                        through: { attributes: [] },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });

    if (userWithCourses == null || userWithCourses.mentor_groups == null) {
        response.sendStatus(HttpStatusCode.InternalServerError);
        return;
    }

    let courses: Course[] = [];
    for (const mentorGroup of userWithCourses.mentor_groups) {
        for (const course of mentorGroup.courses ?? []) {
            courses.push(course);
        }
    }

    response.send(courses);
}

export default {
    create,
    getAll,
    getEditable,
    getMentorable,
};
