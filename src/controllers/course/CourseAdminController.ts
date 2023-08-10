import { Request, Response } from "express";
import { Course } from "../../models/Course";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import CourseAdminValidator from "../_validators/CourseAdminValidator";
import { ValidatorType } from "../_validators/ValidatorType";

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
    const data = request.body.data;

    const validation: ValidatorType = CourseAdminValidator.validateCreateRequest(data);

    if (validation.invalid) {
        response.status(400).send({
            validation: validation.message,
            validation_failed: validation.invalid,
        });
        return;
    }

    const course: Course = await Course.create({
        uuid: data.course_uuid,
        name: data.name_de,
        name_en: data.name_en,
        description: data.description_de,
        description_en: data.description_en,
        is_active: Number(data.active) == 1,
        self_enrollment_enabled: Number(data.self_enrol) == 1,
        initial_training_type: Number(data.training_id),
        skill_template_id: Number(data.skill_template_id) == 0 || isNaN(Number(data.skill_template_id)) ? null : data.skill_template_id,
    });
    if (course == null) {
        response.status(500).send({ error: "An error occurred creating the course" });
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
