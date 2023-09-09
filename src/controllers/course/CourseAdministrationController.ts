import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import _CourseAdministrationValidator from "./_CourseAdministration.validator";
import ValidationHelper from "../../utility/helper/ValidationHelper";
import { Course } from "../../models/Course";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { HttpStatusCode } from "axios";
import { MentorGroup } from "../../models/MentorGroup";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingType } from "../../models/TrainingType";
import { sequelize } from "../../core/Sequelize";

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
 * @param next
 */
async function createCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const body: ICourseBody = request.body as ICourseBody;

        _CourseAdministrationValidator.validateUpdateOrCreateRequest(body);

        if (!(await user.canManageCourseInMentorGroup(Number(body.mentor_group_id)))) {
            response.sendStatus(HttpStatusCode.Forbidden);
            return;
        }

        const skillTemplateID = isNaN(Number(body.skill_template_id)) || body.skill_template_id == "-1" ? null : Number(body.skill_template_id);
        const t = await sequelize.transaction();

        try {
            const course = await Course.create(
                {
                    uuid: body.course_uuid,
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
                    transaction: t,
                }
            );

            await MentorGroupsBelongsToCourses.create(
                {
                    mentor_group_id: Number(body.mentor_group_id),
                    course_id: course.id,
                    can_edit_course: true,
                },
                {
                    transaction: t,
                }
            );

            await t.commit();
            response.status(HttpStatusCode.Created).send({ uuid: course.uuid });
        } catch (e) {
            await t.rollback();
        }
    } catch (e) {
        next(e);
    }
}

/**
 * Validates and updates a course based on the request
 * @param request
 * @param response
 * @param next
 */
async function updateCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = request.body.user;
        const body: ICourseBody = request.body as ICourseBody;

        _CourseAdministrationValidator.validateUpdateOrCreateRequest(body);

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
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of all courses
 * @param request
 * @param response
 */
async function getAllCourses(request: Request, response: Response) {
    const courses = await Course.findAll();
    response.send(courses);
}

/**
 * Gets basic course information based on the provided course UUID.
 * This includes the initial training type alongside the skill template used for this course (or null, if this is not set)
 * @param request
 * @param response
 */
async function getCourse(request: Request, response: Response) {
    const params = request.params as { course_uuid: string };

    const course = await Course.findOne({
        where: {
            uuid: params.course_uuid,
        },
        include: [Course.associations.training_type, Course.associations.skill_template],
    });

    if (course == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    response.send(course);
}

/**
 * Returns a list of users that are enrolled in this course.
 * @param request
 * @param response
 */
async function getCourseParticipants(request: Request, response: Response) {
    const params = request.params as { course_uuid: string };

    const course = await Course.findOne({
        where: {
            uuid: params.course_uuid,
        },
        include: [Course.associations.users],
    });

    if (course == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    response.send(course.users);
}

/**
 * Removed a user from the specified course
 * @param request
 * @param response
 */
async function removeCourseParticipant(request: Request, response: Response) {
    const params = request.params as { course_uuid: string };
    const body = request.body as { user_id: number };

    const validation = _CourseAdministrationValidator.validateRemoveParticipantRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    const courseID = await Course.getIDFromUUID(params.course_uuid);
    if (courseID == -1) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    await UsersBelongsToCourses.destroy({
        where: {
            user_id: body.user_id,
            course_id: courseID,
        },
    });

    await TrainingRequest.destroy({
        where: {
            user_id: body.user_id,
            course_id: courseID,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Returns a list of mentor groups that are associated with this course
 * This does not include the permission such as 'can_edit'
 * @param request
 * @param response
 */
async function getCourseMentorGroups(request: Request, response: Response) {
    const params = request.params as { course_uuid: string };

    const course = await Course.findOne({
        where: {
            uuid: params.course_uuid,
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

    if (course == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    response.send(course.mentor_groups);
}

/**
 * Adds a mentor group with the specified information to the course
 * @param request
 * @param response
 */
async function addMentorGroupToCourse(request: Request, response: Response) {
    const body = request.body as { course_uuid: string; mentor_group_id: number; can_edit: boolean };

    const validation = _CourseAdministrationValidator.validateAddMentorGroupRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    const courseID = await Course.getIDFromUUID(body.course_uuid);
    if (courseID == -1) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    await MentorGroupsBelongsToCourses.create({
        mentor_group_id: body.mentor_group_id,
        course_id: courseID,
        can_edit_course: body.can_edit,
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Removes a mentor group from the specified course
 * @param request
 * @param response
 */
async function removeMentorGroupFromCourse(request: Request, response: Response) {
    const body = request.body as { course_uuid: string; mentor_group_id: number };

    const validation = _CourseAdministrationValidator.validateRemoveMentorGroupRequest(body);
    if (validation.invalid) {
        ValidationHelper.sendValidationErrorResponse(response, validation);
        return;
    }

    const courseID = await Course.getIDFromUUID(body.course_uuid);
    if (courseID == -1) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    await MentorGroupsBelongsToCourses.destroy({
        where: {
            course_id: courseID,
            mentor_group_id: body.mentor_group_id,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
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

export default {
    createCourse,
    updateCourse,
    getAllCourses,
    getCourse,
    getCourseParticipants,
    removeCourseParticipant,
    addMentorGroupToCourse,
    removeMentorGroupFromCourse,
    getCourseMentorGroups,

    getMentorable,
    getEditable,
};
