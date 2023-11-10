import { NextFunction, Request, Response } from "express";
import _UserCourseProgressAdministrationValidator from "./_UserCourseProgressAdministration.validator";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { Course } from "../../models/Course";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSession } from "../../models/TrainingSession";
import _GenericValidator from "../_validators/_GenericValidator";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";

async function getInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const query = request.query as { course_uuid: string; user_id: string };
        _UserCourseProgressAdministrationValidator.validateGetAllRequest(query);

        const user = await User.findOne({
            where: {
                id: query.user_id,
            },
            plain: true,
            include: [
                {
                    association: User.associations.courses,
                    include: [
                        {
                            association: Course.associations.training_types,
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
                    include: [
                        TrainingRequest.associations.training_type,
                        {
                            association: TrainingRequest.associations.training_session,
                            attributes: ["id", "mentor_id"],
                            include: [TrainingSession.associations.mentor],
                        },
                    ],
                },
                {
                    association: User.associations.training_sessions,
                    through: {
                        as: "training_session_belongs_to_users",
                    },
                    include: [TrainingSession.associations.training_type, TrainingSession.associations.mentor],
                },
                {
                    association: User.associations.training_logs,
                },
            ],
        });

        if (user == null || user.courses == null || user.courses.length == 0) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(user);
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
        const body = request.body as { course_completed: "0" | "1"; user_id: string; course_uuid: string; next_training_type_id?: string };
        _UserCourseProgressAdministrationValidator.validateUpdateRequest(body);

        const course = await Course.findOne({ where: { uuid: body.course_uuid } });

        if (course == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        await UsersBelongsToCourses.update(
            {
                next_training_type: body.course_completed == "1" ? null : Number(body.next_training_type_id),
                completed: body.course_completed == "1",
            },
            {
                where: { course_id: course.id, user_id: body.user_id },
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
