import { User } from "../../models/User";
import { NextFunction, Request, Response } from "express";
import { Course } from "../../models/Course";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { TrainingRequest } from "../../models/TrainingRequest";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { MentorGroup } from "../../models/MentorGroup";
import { TrainingType } from "../../models/TrainingType";
import { HttpStatusCode } from "axios";
import { ForbiddenException } from "../../exceptions/ForbiddenException";
import { sequelize } from "../../core/Sequelize";

/**
 * Returns courses that are available to the requesting user (i.e. not enrolled in course)
 * @param _request
 * @param response
 * @param next
 */
async function getAvailableCourses(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const myCourses = await user.getCourses();
        const allCourses = await Course.findAll({
            where: {
                is_active: true,
            },
        });

        const filteredCourses = allCourses.filter((course: Course) => {
            return myCourses.find((myCourse: Course) => myCourse.id === course.id) == null;
        });

        response.send(filteredCourses);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets courses that are active and associated to the requesting user (i.e. not completed)
 * @param _request
 * @param response
 * @param next
 */
async function getActiveCourses(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInCourses = await UsersBelongsToCourses.findAll({
            where: {
                user_id: user.id,
                completed: 0,
            },
            include: [UsersBelongsToCourses.associations.course],
        });

        let courses: Course[] = [];
        for (const c of userInCourses) {
            if (c.course != null) courses.push(c.course);
        }

        response.send(courses);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all courses the requesting user has completed
 * @param _request
 * @param response
 * @param next
 */
async function getCompletedCourses(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInCourses = await UsersBelongsToCourses.findAll({
            where: {
                user_id: user.id,
                completed: true,
            },
            include: [UsersBelongsToCourses.associations.course],
        });

        let courses: Course[] = [];
        for (const c of userInCourses) {
            if (c.course != null) courses.push(c.course);
        }

        response.send(courses);
    } catch (e) {
        next(e);
    }
}

/**
 * Enrol the current user in the course
 * @param request
 * @param response
 * @param next
 */
async function enrolInCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { course_uuid: string };

        Validator.validate(body, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
        });

        // Get course in question
        const course: Course | null = await Course.findOne({
            where: {
                uuid: body.course_uuid,
            },
            include: [Course.associations.training_type],
        });

        if (!course?.self_enrollment_enabled) {
            throw new ForbiddenException("The self enrollment is disabled");
        }

        // If Course-Instance couldn't be found, throw an error (caught locally)
        if (course == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        // Enrol user in course
        const userBelongsToCourses = await UsersBelongsToCourses.findOrCreate({
            where: {
                user_id: user.id,
                course_id: course.id,
            },
            defaults: {
                user_id: user.id,
                course_id: course.id,
                completed: false,
                next_training_type: course?.training_type?.id ?? null,
            },
        });

        response.send(userBelongsToCourses);
    } catch (e) {
        next(e);
    }
}

/**
 * Withdraws (un-enrolls) from a course by its UUID
 * @param request
 * @param response
 * @param next
 */
async function withdrawFromCourseByUUID(request: Request, response: Response, next: NextFunction) {
    const transaction = await sequelize.transaction();

    try {
        const user: User = response.locals.user;
        const body = request.body as { course_id: string };

        Validator.validate(body, {
            course_id: [ValidationTypeEnum.NON_NULL],
        });

        await UsersBelongsToCourses.destroy({
            where: {
                course_id: body.course_id,
                user_id: user.id,
            },
            transaction: transaction,
        });

        await TrainingRequest.destroy({
            where: {
                course_id: body.course_id,
                user_id: user.id,
            },
            transaction: transaction,
        });

        await transaction.commit();
        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        await transaction.rollback();
        next(e);
    }
}

/**
 * Gets all courses that the current user can mentor (i.e. is member of a mentor group, which is
 * assigned to a course)
 * @param _request
 * @param response
 * @param next
 */
async function getMentorable(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        if (!(await user.isMentor())) {
            throw new ForbiddenException("You are not a mentor");
        }

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
                            attributes: ["id", "uuid", "name", "name_en"],
                            through: { attributes: [] },
                            include: [
                                {
                                    association: Course.associations.training_types,
                                    attributes: ["id", "name", "type"],
                                    through: { attributes: [] },
                                    include: [
                                        {
                                            association: TrainingType.associations.training_stations,
                                            attributes: ["id", "callsign", "frequency"],
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
    } catch (e) {
        next(e);
    }
}

/**
 * Gets the courses that the user can actively edit
 * These are all courses associated to a user through their respective
 * mentor groups, where admin == true!
 *
 * This is only used to display the course list, so we can simply use the respective permission
 * @param _request
 * @param response
 * @param next
 */
async function getEditable(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        if (!(await user.isMentor())) {
            throw new ForbiddenException("You are not a mentor");
        }

        const dbUser = await User.findOne({
            where: {
                id: user.id,
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
                        attributes: ["id", "uuid", "name", "name_en", "is_active", "self_enrollment_enabled"],
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
        if (dbUser == null) {
            response.status(500).send({ message: "User not found" });
            return;
        }

        let courses: Course[] = [];
        for (const mentorGroup of dbUser?.mentor_groups ?? []) {
            for (const course of mentorGroup.courses ?? []) {
                courses.push(course);
            }
        }

        response.send(courses);
    } catch (e) {
        next(e);
    }
}

export default {
    getAvailableCourses,
    getActiveCourses,
    getCompletedCourses,
    enrolInCourse,
    withdrawFromCourseByUUID,
    getMentorable,
    getEditable,
};
