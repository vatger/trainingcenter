import { NextFunction, Request, Response } from "express";
import { TrainingSession } from "../../models/TrainingSession";
import { Op } from "sequelize";
import dayjs from "dayjs";
import { TrainingRequest } from "../../models/TrainingRequest";
import _CPTAdminValidator from "./_CPTAdmin.validator";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { HttpStatusCode } from "axios";
import { generateUUID } from "../../utility/UUID";
import { TrainingSessionBelongsToUsers } from "../../models/through/TrainingSessionBelongsToUsers";
import { sequelize } from "../../core/Sequelize";
import { User } from "../../models/User";
import { ValidationException } from "../../exceptions/ValidationException";
import { TrainingType } from "../../models/TrainingType";
import { TrainingStation } from "../../models/TrainingStation";

/**
 * Returns a list of currently scheduled CPTs
 * @param request
 * @param response
 * @param next
 */
async function getOpen(request: Request, response: Response, next: NextFunction) {
    // TODO: Limit response to mentor groups able to mentor this
    // from the course, since we have this relationship anyway

    try {
        let requests = await TrainingSession.findAll({
            where: {
                date: {
                    [Op.gte]: dayjs.utc().toDate(),
                },
            },
            include: [
                TrainingSession.associations.users,
                TrainingSession.associations.training_station,
                TrainingSession.associations.training_type,
                TrainingSession.associations.mentor,
                TrainingSession.associations.cpt_examiner,
            ],
        });

        requests = requests.filter(r => {
            return r.training_type?.type == "cpt";
        });

        response.send(requests);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of Training Requests of type CPT, where no examiner is present yet
 * @param request
 * @param response
 * @param next
 */
async function getAvailable(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        let availableCPTs = await TrainingSession.findAll({
            where: {
                date: {
                    [Op.gte]: dayjs.utc().toDate(),
                },
                [Op.or]: [
                    {
                        cpt_examiner_id: null,
                    },
                    {
                        mentor_id: null,
                    },
                ],
            },
            include: [
                TrainingSession.associations.training_type,
                TrainingSession.associations.users,
                TrainingSession.associations.training_station,
                TrainingSession.associations.mentor,
                TrainingSession.associations.cpt_examiner,
            ],
        });

        availableCPTs = availableCPTs.filter(c => {
            const isUserInvolved = user.id == c.cpt_examiner_id || user.id == c.mentor_id;
            return c.training_type?.type == "cpt" && !isUserInvolved;
        });

        response.send(availableCPTs);
    } catch (e) {
        next(e);
    }
}

async function createCPT(request: Request, response: Response, next: NextFunction) {
    const t = await sequelize.transaction();

    try {
        const body = request.body as { trainee_id: string; course_id: string; date: string; training_type_id: string; training_station_id: string };
        _CPTAdminValidator.validateCreateRequest(body);

        // Check if user already has CPT planned!
        const user = await User.findOne({
            where: {
                id: body.trainee_id,
            },
            include: [
                {
                    association: User.associations.training_sessions,
                    include: [TrainingSession.associations.training_type],
                },
            ],
        });

        for (const sess of user?.training_sessions ?? []) {
            if (sess.training_type?.type == "cpt" && sess.completed == false) {
                throw new ValidationException({ invalid: true, message: ["The user already has a CPT planned"] });
            }
        }

        // Check if the user is in the course
        const userInCourse = await UsersBelongsToCourses.findOne({
            where: {
                user_id: body.trainee_id,
                course_id: body.course_id,
            },
        });

        if (userInCourse == null || user == null) {
            // User is not in course
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        const session = await TrainingSession.create(
            {
                uuid: generateUUID(),
                course_id: Number(body.course_id),
                training_type_id: Number(body.training_type_id),
                training_station_id: Number(body.training_station_id),
                date: dayjs.utc(body.date).toDate(),
            },
            {
                transaction: t,
            }
        );

        const userBelongsToSession = await TrainingSessionBelongsToUsers.create(
            {
                training_session_id: session.id,
                user_id: Number(body.trainee_id),
                log_id: null,
                passed: null,
            },
            {
                transaction: t,
            }
        );

        // TODO: Create ATSIM Request here!

        await t.commit();

        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        await t.rollback();
        next(e);
    }
}

async function addMentor(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { training_session_id: string };
        _CPTAdminValidator.validateAddMentorRequest(body);

        const session = await TrainingSession.findOne({
            where: {
                id: body.training_session_id,
            },
        });

        if (session == null || session?.mentor_id != null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        await session.update({
            mentor_id: user.id,
        });

        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a CPT Examiner to the Session
 * @param request
 * @param response
 * @param next
 */
async function addExaminer(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { training_session_id: string; examiner: boolean };
        _CPTAdminValidator.validateAddMentorRequest(body);

        const session = await TrainingSession.findOne({
            where: {
                [Op.and]: [
                    {
                        id: body.training_session_id,
                    },
                ],
            },
        });

        if (
            session == null ||
            (session?.mentor_id != null && !body.examiner) ||
            (session?.cpt_examiner_id != null && body.examiner) ||
            [session?.mentor_id, session?.cpt_examiner_id].includes(user.id)
        ) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        if (body.examiner) {
            await session.update({
                cpt_examiner_id: user.id,
            });
        } else {
            await session.update({
                mentor_id: user.id,
            });
        }

        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        next(e);
    }
}

async function removeMentor(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { training_session_id: string };
        _CPTAdminValidator.validateRemoveMentorRequest(body);

        const session = await TrainingSession.findOne({
            where: {
                id: body.training_session_id,
            },
        });

        if (session == null || session?.mentor_id != user.id) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        await session.update({
            mentor_id: null,
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

async function getMyExaminerCPTs(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const cpts = await TrainingSession.findAll({
            where: {
                [Op.or]: [
                    {
                        cpt_examiner_id: user.id,
                    },
                    {
                        mentor_id: user.id,
                    },
                ],
                completed: false,
            },
            include: [
                TrainingSession.associations.mentor,
                TrainingSession.associations.users,
                TrainingSession.associations.training_station,
                TrainingSession.associations.cpt_examiner,
            ],
        });

        response.send(cpts);
    } catch (e) {
        next(e);
    }
}

async function removeMyExaminerCPT(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { training_session_id: string };
        _CPTAdminValidator.validateRemoveMentorRequest(body);

        const session = await TrainingSession.findOne({
            where: {
                id: body.training_session_id,
            },
        });

        if (session == null || (session?.cpt_examiner_id != user.id && session?.mentor_id != user.id)) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        if (session.cpt_examiner_id == user.id) {
            await session.update({
                cpt_examiner_id: null,
            });
        } else if (session.mentor_id == user.id) {
            await session.update({
                mentor_id: null,
            });
        }

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

async function getAll(request: Request, response: Response, next: NextFunction) {
    try {
        // TODO: Check if user is allowed to access CPTs
        const cpts = await TrainingSession.findAll({
            include: [
                {
                    association: TrainingSession.associations.training_type,
                    where: {
                        type: "cpt",
                    },
                },
                TrainingSession.associations.cpt_examiner,
                TrainingSession.associations.users,
                TrainingSession.associations.training_station,
            ],
        });

        response.send(cpts);
    } catch (e) {
        next(e);
    }
}

async function deleteCPT(request: Request, response: Response, next: NextFunction) {
    try {
        // TODO: Check if user is allowed to delete CPT & Validation
        const body = request.body as { cpt_id: string };

        const trainingSession = await TrainingSession.findOne({
            where: {
                id: body.cpt_id,
            },
            include: [TrainingSession.associations.training_type],
        });

        if (trainingSession == null || trainingSession.training_type?.type != "cpt") {
            response.sendStatus(HttpStatusCode.NotFound);
        }

        await trainingSession?.destroy();
        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

export default {
    getAll,
    deleteCPT,
    getOpen,
    getAvailable,
    createCPT,
    addMentor,
    addExaminer,
    removeMentor,
    getMyExaminerCPTs,
    removeMyExaminerCPT,
};
