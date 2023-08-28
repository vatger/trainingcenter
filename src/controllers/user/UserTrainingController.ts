import { Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingRequest } from "../../models/TrainingRequest";
import { Course } from "../../models/Course";
import { HttpStatusCode } from "axios";
import { Op } from "sequelize";

/**
 * Get a list of all training-requests made by this user
 * @param request
 * @param response
 */
async function getRequests(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const user = await User.findOne({
        where: {
            id: reqUser.id,
        },
        include: [User.associations.training_requests],
    });

    response.send(user?.training_requests ?? []);
}

/**
 * Get a list of all training-requests made by this user for a specified course
 * @param request
 * @param response
 */
async function getRequestsByUUID(request: Request, response: Response) {
    const reqUser: User = request.body.user;
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
}

async function getActiveRequestsByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
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

    response.send(
        trainingRequests.filter(t => {
            return t.status == "requested" || t.status == "planned";
        })
    );
}

export default {
    getRequests,
    getRequestsByUUID,
    getActiveRequestsByUUID,
};
