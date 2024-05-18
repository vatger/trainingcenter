import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { Course } from "../../models/Course";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";

/**
 * Returns all the user's courses that the requesting user is also a mentor of
 * Courses that the user is not a mentor of will be filtered out
 * @param request
 * @param response
 */
async function getUserCourseMatch(request: Request, response: Response) {
    const reqUser: User = response.locals.user;
    const userID = request.query.user_id;
    const mentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();

    if (userID == null) {
        response.status(404).send({ message: "No User ID supplied" });
        return;
    }

    const user: User | null = await User.findOne({
        where: {
            id: userID.toString(),
        },
        include: [User.associations.courses],
    });

    if (user == null) {
        response.status(404).send({ message: "User with this ID not found" });
        return;
    }

    let courses: Course[] | undefined = user.courses?.filter((course: Course) => {
        for (const mG of mentorGroups) {
            if (mG.courses?.find((c: Course) => c.id == course.id) != null) {
                return true;
            }
        }

        return false;
    });

    if (courses == null) {
        response.status(500).send();
        return;
    }

    response.send(courses);
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

        // TODO: Check Permissions

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            course_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER, { option: ValidationTypeEnum.NOT_EQUAL, value: -1 }],
        });

        const course = await Course.findByPk(body.course_id);
        if (course == null) {
            throw new Error("Course with specified id couldn't be found");
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
                next_training_type: course.training_type?.id ?? null,
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
