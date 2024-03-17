import { User } from "../../models/User";
import { NextFunction, Request, Response } from "express";
import { Course } from "../../models/Course";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { TrainingRequest } from "../../models/TrainingRequest";

/**
 * Returns courses that are available to the current user (i.e. not enrolled in course)
 * @param request
 * @param response
 */
async function getAvailableCourses(request: Request, response: Response) {
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
}

/**
 * Gets courses that are active and associated to the current user (i.e. not completed)
 * @param request
 * @param response
 */
async function getActiveCourses(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const userInCourses = await UsersBelongsToCourses.findAll({
        where: {
            user_id: reqUser.id,
            completed: 0,
        },
        include: [UsersBelongsToCourses.associations.course],
    });

    let courses: Course[] = [];
    for (const c of userInCourses) {
        if (c.course != null) courses.push(c.course);
    }

    response.send(courses);
}

async function getCompletedCourses(request: Request, response: Response, next: NextFunction) {
    try {
        const reqUser: User = response.locals.user;

        const userInCourses = await UsersBelongsToCourses.findAll({
            where: {
                user_id: reqUser.id,
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
 * Returns all courses that are associated to the current user (i.e. enrolled in course or completed)
 * @param request
 * @param response
 */
async function getMyCourses(request: Request, response: Response) {
    const reqUser: User = response.locals.user;

    const user = await User.findOne({
        where: {
            id: reqUser.id,
        },
        include: {
            association: User.associations.courses,
            through: {
                as: "through",
            },
        },
    });

    response.send(user?.courses ?? []);
}

/**
 * Enrol the current user in the course
 * @param request
 * @param response
 */
async function enrolInCourse(request: Request, response: Response) {
    const user: User = response.locals.user;
    const query = request.body as { course_uuid: string };

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "course_uuid",
    //         validationObject: query.course_uuid,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

    // Get course in question
    const course: Course | null = await Course.findOne({
        where: {
            uuid: query.course_uuid,
        },
        include: [Course.associations.training_type],
    });

    // If Course-Instance couldn't be found, throw an error (caught locally)
    if (course == null) {
        throw Error("Course with id " + query.course_uuid + " could not be found!");
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
}

/**
 *
 * @param request
 * @param response
 */
async function withdrawFromCourseByUUID(request: Request, response: Response) {
    const user: User = response.locals.user;
    const courseID = request.body.course_id;

    if (courseID == null) {
        response.send(404);
        return;
    }

    await UsersBelongsToCourses.destroy({
        where: {
            course_id: courseID,
            user_id: user.id,
        },
    });

    await TrainingRequest.destroy({
        where: {
            course_id: courseID,
            user_id: user.id,
        },
    });

    response.send({ message: "OK" });
}

export default {
    getAvailableCourses,
    getActiveCourses,
    getCompletedCourses,
    getMyCourses,
    enrolInCourse,
    withdrawFromCourseByUUID,
};
