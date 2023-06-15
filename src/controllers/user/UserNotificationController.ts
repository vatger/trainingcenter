import { Request, Response } from "express";
import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { Op } from "sequelize";

/**
 * Returns all unread notifications for the requesting user
 * @param request
 * @param response
 */
async function getUnreadNotifications(request: Request, response: Response) {
    const user: User = request.body.user;

    const notifications: Notification[] = await Notification.findAll({
        where: {
            [Op.and]: {
                user_id: user.id,
                read: false,
            },
        },
        include: [Notification.associations.author],
    });

    response.send(notifications);
}

export default {
    getUnreadNotifications,
};
