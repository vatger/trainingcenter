import { Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { TrainingRequest } from "../../models/TrainingRequest";
import { Op } from "sequelize";

/**
 * Returns all training requests that the current user is able to mentor based on his mentor groups
 * @param request
 * @param response
 */
async function getOpen(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const reqUserMentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();
    let trainingRequests: TrainingRequest[] = await TrainingRequest.findAll({
        where: {
            [Op.and]: {
                expires: {
                    [Op.gte]: new Date(),
                },
                status: {
                    [Op.like]: "requested",
                },
                training_session_id: null,
            },
        },
        include: [TrainingRequest.associations.training_station, TrainingRequest.associations.training_type, TrainingRequest.associations.user],
    });

    // Store course IDs that a user can mentor in
    const courseIDs: number[] = [];

    for (const mentorGroup of reqUserMentorGroups) {
        for (const course of mentorGroup.courses ?? []) {
            if (!courseIDs.includes(course.id)) courseIDs.push(course.id);
        }
    }

    trainingRequests = trainingRequests.filter((req: TrainingRequest) => {
        return courseIDs.includes(req.course_id);
    });

    response.send(trainingRequests);
}

/**
 * Returns training request information by its UUID
 * @param request
 * @param response
 */
async function getByUUID(request: Request, response: Response) {
    const trainingRequestUUID = request.params.uuid;

    const trainingRequest = await TrainingRequest.findOne({
        where: {
            uuid: trainingRequestUUID,
        },
        include: [TrainingRequest.associations.user, TrainingRequest.associations.training_type, TrainingRequest.associations.training_station],
    });

    response.send(trainingRequest);
}

export default {
    getOpen,
    getByUUID,
};
