import { Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { TrainingRequest } from "../../models/TrainingRequest";
import { Op } from "sequelize";
import NotificationLibrary from "../../libraries/notification/NotificationLibrary";
import { TrainingType } from "../../models/TrainingType";

/**
 * Returns all currently open training requests
 * Method should not be called from router
 */
async function _getOpenTrainingRequests(): Promise<TrainingRequest[]> {
    return await TrainingRequest.findAll({
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
}

/**
 * Returns all training requests that the current user is able to mentor based on his mentor groups
 * @param request
 * @param response
 */
async function getOpen(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const reqUserMentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();
    let trainingRequests: TrainingRequest[] = await _getOpenTrainingRequests();

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
 * Returns all training requests that the current user is able to mentor based on his mentor groups
 * Only returns Trainings (not lessons)
 * @param request
 * @param response
 */
async function getOpenTrainingRequests(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const reqUserMentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();
    let trainingRequests: TrainingRequest[] = (await _getOpenTrainingRequests()).filter((trainingRequest: TrainingRequest) => {
        return trainingRequest.training_type?.type != "lesson";
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
 * Returns all training requests that the current user is able to mentor based on his mentor groups
 * Only returns Lessons (not anything else)
 * @param request
 * @param response
 */
async function getOpenLessonRequests(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const reqUserMentorGroups: MentorGroup[] = await reqUser.getMentorGroupsAndCourses();
    let trainingRequests: TrainingRequest[] = (await _getOpenTrainingRequests()).filter((trainingRequest: TrainingRequest) => {
        return trainingRequest.training_type?.type == "lesson";
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

    const trainingRequest: TrainingRequest | null = await TrainingRequest.findOne({
        where: {
            uuid: trainingRequestUUID,
        },
        include: [
            TrainingRequest.associations.user,
            TrainingRequest.associations.training_station,
            TrainingRequest.associations.course,
            {
                association: TrainingRequest.associations.training_type,
                include: [
                    {
                        association: TrainingType.associations.training_stations,
                        attributes: ["id", "callsign", "deactivated"],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            },
        ],
    });

    if (trainingRequest == null) {
        response.status(404).send({ message: "Training request with this UUID not found" });
        return;
    }

    response.send(trainingRequest);
}

/**
 * Allows a mentor (or above) to delete the training request of a user based on its UUID.
 * @param request
 * @param response
 */
async function destroyByUUID(request: Request, response: Response) {
    const trainingRequestUUID: string = request.params.uuid;

    const trainingRequest: TrainingRequest | null = await TrainingRequest.findOne({
        where: {
            uuid: trainingRequestUUID,
        },
        include: [TrainingRequest.associations.training_type],
    });

    if (trainingRequest == null) {
        response.status(404).send({ message: "Training request with this UUID not found" });
        return;
    }

    await trainingRequest.destroy();

    await NotificationLibrary.sendUserNotification({
        user_id: trainingRequest.user_id,
        message_de: `Deine Trainingsanfrage für "${trainingRequest.training_type?.name}" wurde von $author gelöscht`,
        message_en: `$author has deleted your training request for "${trainingRequest.training_type?.name}"`,
        author_id: request.body.user.id,
        severity: "default",
        icon: "trash",
    });

    response.send({ message: "OK" });
}

export default {
    getOpen,
    getOpenTrainingRequests,
    getOpenLessonRequests,
    getByUUID,
    destroyByUUID,
};
