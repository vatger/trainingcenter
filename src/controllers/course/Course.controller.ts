import { Request, Response } from "express";
import { User } from "../../models/User";
import { Course } from "../../models/Course";

/**
 * Gets all courses
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const courses = await Course.findAll();
    response.send(courses);
}

/**
 * Gets all courses including the users associated to these courses
 * @param request
 * @param response
 */
async function getAllWithUsers(request: Request, response: Response) {
    const courses = await Course.findAll({
        include: {
            association: User.associations.courses,
            through: {
                as: "through",
            },
        },
    });

    response.send(courses);
}

export default {
    getAll,
    getAllWithUsers,
};
