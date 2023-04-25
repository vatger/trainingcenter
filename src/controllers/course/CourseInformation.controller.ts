import { Request, Response } from "express";
import { Course } from "../../models/Course";
import { User } from "../../models/User";
import { TrainingSession } from "../../models/TrainingSession";

/**
 * Returns course information based on the provided uuid (request.query.uuid)
 * @param request
 * @param response
 */
async function getInformationByUUID(request: Request, response: Response) {
    const uuid: string = request.query.uuid?.toString() ?? "";

    const course: Course | null = await Course.findOne({
        where: {
            uuid: uuid,
        },
        include: [
            {
                association: Course.associations.information,
                as: "information",
            },
            {
                association: Course.associations.training_type,
                as: "initial_training_type",
            },
            {
                association: Course.associations.action_requirements,
                as: "action_requirements",
            },
        ],
    });

    if (course == null) {
        response.status(500).send({ message: "Failed to get Course with uuid" });
        return;
    }

    response.send(course);
}

/**
 * Returns user information for a given course (request.query.uuid)
 * Includes the users_belong_to_courses table entry for the current user
 * @param request
 * @param response
 */
async function getUserCourseInformationByUUID(request: Request, response: Response) {
    const reqUser: User = request.body.user;
    const course_uuid: string = request.query.uuid?.toString() ?? "";

    if (!(await reqUser.isMemberOfCourse(course_uuid))) {
        response.status(403).send({ message: "You are not enrolled in this course" });
        return;
    }

    const user = await User.findOne({
        where: {
            id: reqUser.id,
        },
        include: [
            {
                association: User.associations.courses,
                where: {
                    uuid: course_uuid,
                },
            },
        ],
    });

    response.send(user?.courses ?? []);
}

/**
 * Returns training information for the current user in the specified course
 * @param request
 * @param response
 */
async function getCourseTrainingInformationByUUID(request: Request, response: Response) {
    const user: User = request.body.user;
    const course_uuid: string = request.query.uuid?.toString() ?? "";

    if (!(await user.isMemberOfCourse(course_uuid))) {
        response.status(403).send({ message: "You are not enroled in this course" });
        return;
    }

    const data = await User.findOne({
        where: {
            id: user.id,
        },
        include: [
            {
                association: User.associations.training_sessions,
                as: "training_sessions",
                through: {
                    as: "through",
                    attributes: ["passed"],
                    where: {
                        user_id: user.id,
                    },
                },
                include: [
                    {
                        association: TrainingSession.associations.training_logs,
                        attributes: ["uuid", "log_public"],
                        as: "training_logs",
                        through: { attributes: [] },
                    },
                    {
                        association: TrainingSession.associations.training_type,
                        attributes: ["id", "name", "type"],
                        as: "training_type",
                    },
                    {
                        association: TrainingSession.associations.course,
                        where: {
                            uuid: course_uuid,
                        },
                        attributes: ["uuid"],
                        as: "course",
                    },
                ],
            },
        ],
    });

    response.send(data?.training_sessions ?? []);
}

export default {
    getInformationByUUID,
    getUserCourseInformationByUUID,
    getCourseTrainingInformationByUUID,
};
