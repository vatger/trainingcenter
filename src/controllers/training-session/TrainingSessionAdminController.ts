import { Request, Response } from "express";
import { User } from "../../models/User";
import _TrainingSessionAdminValidator from "./_TrainingSessionAdminValidator";
import { Course } from "../../models/Course";
import { TrainingSession } from "../../models/TrainingSession";
import { generateUUID } from "../../utility/UUID";
import dayjs from "dayjs";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";

/**
 * Creates a new training session with one user and one mentor
 */
async function createTrainingSession(request: Request, response: Response) {
    // TODO: Check if the mentor of the course is even allowed to create such a session!

    const requestUser: User = request.body.user as User;
    const data = request.body.data as { course_uuid?: string, date?: string, training_type_id?: number, training_station_id?: number, user_ids?: number[] };

    const validation = _TrainingSessionAdminValidator.validateCreateSessionRequest(data);

    if (validation.invalid) {
        response.status(400).send({
            validation: validation.message,
            validation_failed: true,
        });
        return;
    }

    // 1. Find out which of these users is actually enrolled in the course. To do this, query the course and it's members, and check against the array of user_ids. Create a new actual array with only those people
    // that are actually enroled in this course.
    let courseParticipants: number[] = [];
    const course = await Course.findOne({
        where: {
            uuid: data.course_uuid
        },
        include: [Course.associations.users]
    });

    if (course == null) {
        response.sendStatus(500);
        return;
    }

    // Filter the requested users that are also enrolled in this course.
    data.user_ids?.filter((userID) => {
        if (course.users?.find(courseUser => courseUser.id == userID)) {
            courseParticipants.push(userID);
        }
    });

    if (courseParticipants.length == 0) {
        response.status(400).send({error: "No specified user was a member of this course."});
        return;
    }

    // Create Session
    const trainingSession = await TrainingSession.create({
        uuid: generateUUID(),
        mentor_id: requestUser.id,
        training_station_id: data.training_station_id,
        date: dayjs(data.date).toDate(),
        training_type_id: data.training_type_id,
        course_id: course.id
    });

    if (trainingSession == null) {
        response.sendStatus(500);
        return;
    }

    // For each one of these members, delete their training requests from the course and training_type_id.
    for (const userID of courseParticipants) {
        const request = await TrainingRequest.findOne({
            where: {
                user_id: userID,
                course_id: course.id,
                training_type_id: data.training_type_id
            }
        });

        if (request == null) {
            await TrainingRequest.create({
                uuid: generateUUID(),
                user_id: userID,
                training_type_id: data.training_type_id,
                course_id: course.id,
                training_station_id: data.training_station_id,
                status: "planned",
                expires: dayjs().add(1, 'month').toDate(),
                training_session_id: trainingSession.id
            });
        } else {
            await request.update({
                status: "planned",
                training_session_id: trainingSession.id
            });
        }

        await TrainingSessionBelongsToUsers.create({
            training_session_id: trainingSession.id,
            user_id: userID
        });
    }

    response.send(data.user_ids);
}

export default {
    createTrainingSession,
};
