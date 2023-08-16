import { Request, Response } from "express";
import { User } from "../../models/User";
import { MentorGroup } from "../../models/MentorGroup";
import { TrainingRequest } from "../../models/TrainingRequest";
import { Op } from "sequelize";
import NotificationLibrary from "../../libraries/notification/NotificationLibrary";
import { TrainingType } from "../../models/TrainingType";
import { TrainingSession } from "../../models/TrainingSession";

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
 * Returns all the planned sessions of the current user as either mentor or CPT examiner
 * The differentiation between mentor & examiner must be done in the frontend
 * @param request
 * @param response
 */
async function getPlanned(request: Request, response: Response) {
    const user: User = request.body.user;

    let trainingSession = await TrainingSession.findAll({
        where: {
            [Op.or]: {
                mentor_id: user.id,
                cpt_examiner_id: user.id
            },
        },
        include: [
            TrainingSession.associations.course,
            TrainingSession.associations.training_type,
            {
                association: TrainingSession.associations.training_session_belongs_to_users,
                attributes: ['passed']
            }
        ]
    });

    /*
        For each training session, we need to check whether there is at least one associated participant, who has not yet received a log
        If the log doesn't exist, then this acts as a reminder to the mentor to fill out this log. Only when all participants have received a log
        entry, will the session be shown as "complete"
     */
    trainingSession = trainingSession.filter((trainingSession: TrainingSession) => {
        let hasOneNonPassed = false;
        if (trainingSession.training_session_belongs_to_users == null || trainingSession.training_session_belongs_to_users.length == 0) {
            return true;
        }

        for (const userSession of trainingSession.training_session_belongs_to_users) {
            if (userSession.log_id == null) {
                hasOneNonPassed = true;
            }
        }

        return hasOneNonPassed;
    })

    response.send(trainingSession);
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
    getPlanned,
    getOpenTrainingRequests,
    getOpenLessonRequests,
    getByUUID,
    destroyByUUID,
};
