import { NextFunction, Request, Response } from "express";
import _UserCourseProgressAdministrationValidator from "./_UserCourseProgressAdministration.validator";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { Course } from "../../models/Course";

async function getInformation(request: Request, response: Response, next: NextFunction) {
    try {
        const query = request.query as { course_uuid: string; user_id: string };
        console.log(query);
        _UserCourseProgressAdministrationValidator.validateGetAllRequest(query);

        const user = await User.findOne({
            where: {
                id: query.user_id,
            },
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
                },
                {
                    association: User.associations.training_sessions,
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

export default {
    getInformation,
};
