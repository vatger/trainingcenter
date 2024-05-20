import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { Course } from "../../models/Course";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { HttpStatusCode } from "axios";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Returns all the user's courses that the requesting user is also a mentor of
 * Courses that the user is not a mentor of will be filtered out
 * @param request
 * @param response
 * @param next
 */
async function getUserCourseMatch(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { user_id: string };
        const mentorGroups: MentorGroup[] = await user.getMentorGroupsAndCourses();

        const dbUser: User | null = await User.findOne({
            where: {
                id: query.user_id.toString(),
            },
            include: [User.associations.courses],
        });

        if (dbUser == null) {
            response.status(404).send({ message: "User with this ID not found" });
            return;
        }

        let courses: Course[] | undefined = dbUser.courses?.filter((course: Course) => {
            for (const mentorGroup of mentorGroups) {
                if (mentorGroup.courses?.find((c: Course) => c.id == course.id) != null) {
                    return true;
                }
            }

            return false;
        });

        if (courses == null) {
            response.sendStatus(HttpStatusCode.InternalServerError);
            return;
        }

        response.send(courses);
    } catch (e) {
        next(e);
    }
}

/**
 * Enrols a user in the specified course. Useful, if the course's registration is disabled for example.
 * @param request
 * @param response
 * @param next
 */
async function enrolUser(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const body = request.body as { user_id: string; course_id: string };
        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            course_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER, { option: ValidationTypeEnum.NOT_EQUAL, value: -1 }],
        });

        const courseUUID = await Course.getUUIDFromID(body.course_id);
        if (!(await user.isMentorInCourse(courseUUID))) {
            throw new ForbiddenException("You are not a mentor of this course");
        }

        const course = await Course.findByPk(body.course_id);
        if (course == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await UsersBelongsToCourses.findOrCreate({
            where: {
                user_id: body.user_id,
                course_id: body.course_id,
            },
            defaults: {
                user_id: Number(body.user_id),
                course_id: Number(body.course_id),
                completed: false,
                next_training_type: course.initial_training_type ?? null,
            },
        });

        response.send(course);
    } catch (e) {
        next(e);
    }
}

export default {
    getUserCourseMatch,
    enrolUser,
};
