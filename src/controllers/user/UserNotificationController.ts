import { Request, Response } from "express";
import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { Op } from "sequelize";

async function getNotifications(request: Request, response: Response) {
    const user: User = request.body.user;

    const notifications: Notification[] = await Notification.findAll({
        where: {
            user_id: user.id,
        },
        order: [["createdAt", "desc"]],
        include: [{
            association: Notification.associations.author,
            attributes: ['id', 'first_name', 'last_name']
        }],
    });

    response.send(notifications);
}

/**
 * Returns all unread notifications for the requesting user
 * @param request
 * @param response
 */
async function getUnreadNotifications(request: Request, response: Response) {
    const user: User = request.body.user;

    const notifications: Notification[] = await Notification.findAll({
        where: {
            user_id: user.id,
            read: false,
        },
        order: [["createdAt", "desc"]],
        include: [{
            association: Notification.associations.author,
            attributes: ['id', 'first_name', 'last_name']
        }],
    });

    response.send(notifications);
}

export default {
    getNotifications,
    getUnreadNotifications,
};
