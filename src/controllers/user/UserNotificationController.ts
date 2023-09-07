import { Request, Response } from "express";
import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { Op } from "sequelize";
import { HttpStatusCode } from "axios";

async function getNotifications(request: Request, response: Response) {
    const user: User = request.body.user;

    const notifications: Notification[] = await Notification.findAll({
        where: {
            user_id: user.id,
        },
        order: [["createdAt", "desc"]],
        include: [
            {
                association: Notification.associations.author,
                attributes: ["id", "first_name", "last_name"],
            },
        ],
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
        include: [
            {
                association: Notification.associations.author,
                attributes: ["id", "first_name", "last_name"],
            },
        ],
    });

    response.send(notifications);
}

/**
 * Marks all notifications as read
 * @param request
 * @param response
 */
async function markAllNotificationsRead(request: Request, response: Response) {
    const user: User = request.body.user;

    await Notification.update(
        {
            read: true,
        },
        {
            where: {
                user_id: user.id,
            },
        }
    );

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Marks a single notification as read
 */
async function markNotificationRead(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { notification_id: string };

    await Notification.update(
        {
            read: true,
        },
        {
            where: {
                id: body.notification_id,
                user_id: user.id, // Just an additional sanity check, not really needed since the id is PK
            },
        }
    );

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Deletes a single notification
 */
async function deleteNotification(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { notification_id: string };

    await Notification.destroy({
        where: {
            id: body.notification_id,
            user_id: user.id,
        },
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

/**
 * Toggles the read flag of a notification
 * @param request
 * @param response
 */
async function toggleMarkNotificationRead(request: Request, response: Response) {
    const user: User = request.body.user;
    const body = request.body as { notification_id: string };

    const notification = await Notification.findOne({
        where: {
            id: body.notification_id,
            user_id: user.id,
        },
    });

    if (notification == null) {
        response.sendStatus(HttpStatusCode.BadRequest);
        return;
    }

    await notification.update({
        read: !notification.read,
    });

    response.sendStatus(HttpStatusCode.NoContent);
}

export default {
    getNotifications,
    getUnreadNotifications,
    markNotificationRead,
    toggleMarkNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
};
