import { Request, Response } from "express";
import { User } from "../../models/User";

/**
 * Gets all users including their user data (VATSIM Data)
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const users = await User.findAll({
        include: [User.associations.user_data],
    });

    response.send(users);
}

/**
 * Gets all users including their sensitive data (email, etc.)
 * @param request
 * @param response
 */
async function getAllSensitive(request: Request, response: Response) {
    const users = await User.findAll({
        include: [User.associations.user_data],
    });

    response.send(users);
}

/**
 * Gets all users with minimal data only (CID, Name)
 * @param request
 * @param response
 */
async function getAllUsersMinimalData(request: Request, response: Response) {
    const users = await User.findAll({
        attributes: ["id", "first_name", "last_name"],
    });

    response.send(users);
}

export default {
    getAll,
    getAllSensitive,
    getAllUsersMinimalData,
};
