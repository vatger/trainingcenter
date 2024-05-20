import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { Course } from "../../models/Course";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSession } from "../../models/TrainingSession";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Returns information about the progress of a user within the specified course.
 * For example:
 * - Training Requests
 * - Training Sessions
 * - Training Logs
 * etc.
 * @param request
 * @param response
 * @param next
 */
async function getInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { course_uuid: string; user_id: string };
        Validator.validate(query, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        if (!(await user.isMentorInCourse(query.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course");
        }
        const course_id = await Course.getIDFromUUID(query.course_uuid);

        const dbUser = await User.findOne({
            where: {
                id: query.user_id,
            },
            plain: true,
            include: [
                {
                    association: User.associations.courses,
                    attributes: ["uuid", "name"],
                    through: {
                        attributes: ["id", "completed", "next_training_type"],
                    },
                    include: [
                        {
                            association: Course.associations.training_types,
                            attributes: ["id", "name", "type"],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                    where: {
                        uuid: query.course_uuid,
                    },
                },
                {
                    association: User.associations.training_requests,
                    attributes: ["uuid", "status", "createdAt"],
                    where: {
                        course_id: course_id,
                    },
                    required: false,
                    include: [
                        {
                            association: TrainingRequest.associations.training_type,
                            attributes: ["name", "type"],
                        },
                        {
                            association: TrainingRequest.associations.training_session,
                            attributes: ["id", "mentor_id"],
                            include: [TrainingSession.associations.mentor],
                        },
                    ],
                },
                {
                    association: User.associations.training_sessions,
                    attributes: ["id", "uuid", "completed", "date"],
                    where: {
                        course_id: course_id,
                    },
                    required: false,
                    through: {
                        as: "training_session_belongs_to_users",
                    },
                    include: [
                        {
                            association: TrainingSession.associations.training_type,
                            attributes: ["name", "type"],
                        },
                        {
                            association: TrainingSession.associations.mentor,
                        },
                    ],
                },
                {
                    association: User.associations.training_logs,
                    attributes: ["uuid"],
                    through: {
                        attributes: ["id", "training_session_id", "user_id", "passed"],
                    },
                },
            ],
        });

        if (dbUser == null || dbUser.courses == null || dbUser.courses.length == 0) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(dbUser);
    } catch (e) {
        next(e);
    }
}

/**
 * Update the information of the user's progress within a course, such as the completed flag or the next training type
 * @param request
 * @param response
 * @param next
 */
async function updateInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { course_completed: "0" | "1"; user_id: string; course_uuid: string; next_training_type_id?: string };
        Validator.validate(body, {
            course_completed: [ValidationTypeEnum.NON_NULL],
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            course_uuid: [ValidationTypeEnum.NON_NULL],
        });

        if (!(await user.isMentorInCourse(body.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course");
        }

        const courseId = await Course.getIDFromUUID(body.course_uuid);

        if (courseId == -1) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await UsersBelongsToCourses.update(
            {
                next_training_type: body.course_completed == "1" ? null : Number(body.next_training_type_id),
                completed: body.course_completed == "1",
            },
            {
                where: { course_id: courseId, user_id: body.user_id },
            }
        );

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

export default {
    getInformation,
    updateInformation,
};
