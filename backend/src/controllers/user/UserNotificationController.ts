import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { HttpStatusCode } from "axios";

/**
 * Gets all notifications for a specific user
 * @param _request
 * @param response
 * @param next
 */
async function getNotifications(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

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
    } catch (e) {
        next(e);
    }
}

/**
 * Returns all unread notifications for the requesting user
 * @param _request
 * @param response
 * @param next
 */
async function getUnreadNotifications(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

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
    } catch (e) {
        next(e);
    }
}

/**
 * Marks all notifications as read
 * @param _request
 * @param response
 * @param next
 */
async function markAllNotificationsRead(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

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
    } catch (e) {
        next(e);
    }
}

/**
 * Marks a single notification as read
 * @param request
 * @param response
 * @param next
 */
async function markNotificationRead(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
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
    } catch (e) {
        next(e);
    }
}

/**
 * Deletes a single notification
 * @param request
 * @param response
 * @param next
 */
async function deleteNotification(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { notification_id: string };

        await Notification.destroy({
            where: {
                id: body.notification_id,
                user_id: user.id,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Toggles the read flag of a notification
 * @param request
 * @param response
 * @param next
 */
async function toggleMarkNotificationRead(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
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
    } catch (e) {
        next(e);
    }
}

export default {
    getNotifications,
    getUnreadNotifications,
    markNotificationRead,
    toggleMarkNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
};
