import { Request, Response } from "express";
import { User } from "../../models/User";
import { TrainingRequest } from "../../models/TrainingRequest";
import { TrainingSession } from "../../models/TrainingSession";
import { generateUUID } from "../../utility/UUID";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import dayjs from "dayjs";

/**
 * Creates a new training session with one user and one mentor
 */
async function createTrainingSession(request: Request, response: Response) {
    const mentor: User = request.body.user as User;
    const data = request.body.data as { user_id: number; uuid: string; date: string };

    const trainingRequest: TrainingRequest | null = await TrainingRequest.findOne({
        where: {
            uuid: data.uuid,
        },
    });

    if (trainingRequest == null) {
        response.status(404).send({ message: "TrainingRequest with this UUID not found." });
        return;
    }

    const session: TrainingSession = await TrainingSession.create({
        uuid: generateUUID(),
        mentor_id: mentor.id,
        date: dayjs(data.date).toDate(),
        training_type_id: trainingRequest.training_type_id,
        training_station_id: trainingRequest.training_station_id ?? null,
        course_id: trainingRequest.course_id,
    });

    await TrainingSessionBelongsToUsers.create({
        training_session_id: session.id,
        user_id: data.user_id,
    });

    await trainingRequest.update({
        status: "planned",
        training_session_id: session.id,
    });

    response.send(session);
}

/**
 * TODO
 */
async function createLessonSession() {}

export default {
    createTrainingSession,
};
