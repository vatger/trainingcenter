import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingRequest } from "../../models/TrainingRequest";
import { Course } from "../../models/Course";
import { HttpStatusCode } from "axios";

/**
 * Get a list of all training-requests made by this user
 * @param request
 * @param response
 * @param next
 */
async function getRequests(request: Request, response: Response, next: NextFunction) {
    try {
        const reqUser: User = response.locals.user;
        const user = await User.findOne({
            where: {
                id: reqUser.id,
            },
            include: [User.associations.training_requests],
        });

        response.send(user?.training_requests ?? []);
    } catch (e) {
        next(e);
    }
}

/**
 * Get a list of all training-requests made by this user for a specified course
 * @param request
 * @param response
 * @param next
 */
async function getRequestsByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const reqUser: User = response.locals.user;
        const course_uuid: string | undefined = request.params?.course_uuid?.toString();

        const course_id = await Course.getIDFromUUID(course_uuid);
        if (course_id == -1) {
            response.status(500).send("Some error");
            return;
        }

        const trainingRequests: TrainingRequest[] = await TrainingRequest.findAll({
            where: {
                user_id: reqUser.id,
                course_id: course_id,
            },
            include: [TrainingRequest.associations.training_type, TrainingRequest.associations.training_station],
        });

        response.send(trainingRequests);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets information on an active training requests by its UUID
 * @param request
 * @param response
 * @param next
 */
async function getActiveRequestsByUUID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };

        const course = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
        });

        if (course == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        const trainingRequests = await TrainingRequest.findAll({
            where: {
                user_id: user.id,
                course_id: course.id,
            },
            include: [TrainingRequest.associations.training_type, TrainingRequest.associations.training_station],
        });

        for (const trainingRequest of trainingRequests) {
            await trainingRequest.appendNumberInQueue();
        }

        response.send(
            trainingRequests.filter(t => {
                return t.status == "requested" || t.status == "planned";
            })
        );
    } catch (e) {
        next(e);
    }
}

export default {
    getRequests,
    getRequestsByUUID,
    getActiveRequestsByUUID,
};
