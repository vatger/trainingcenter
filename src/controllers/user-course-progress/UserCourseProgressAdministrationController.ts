import { NextFunction, Request, Response } from "express";
import _UserCourseProgressAdministrationValidator from "./_UserCourseProgressAdministration.validator";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { Course } from "../../models/Course";
import {TrainingRequest} from "../../models/TrainingRequest";
import {TrainingSession} from "../../models/TrainingSession";

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
                    include: [TrainingRequest.associations.training_type]
                },
                {
                    association: User.associations.training_sessions,
                    through: {
                        as: "training_session_belongs_to_users",
                    },
                    include: [TrainingSession.associations.training_type, TrainingSession.associations.mentor]
                },
                {
                    association: User.associations.training_logs
                }
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

export default {
    getInformation,
};
