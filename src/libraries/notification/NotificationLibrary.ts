import { Notification } from "../../models/Notification";
import { generateUUID } from "../../utility/UUID";

type Severity = "default" | "info" | "success" | "danger";

type UserNotificationType = {
    user_id: number;
    message_de: string;
    message_en: string;
    severity?: Severity;
    icon?: string;
    author_id?: number;
    link?: string;
};

async function sendUserNotification(notificationType: UserNotificationType) {
    await Notification.create({
        uuid: generateUUID(),
        user_id: notificationType.user_id,
        content_de: notificationType.message_de,
        content_en: notificationType.message_en,
        link: notificationType.link ?? null,
        icon: notificationType.icon ?? null,
        severity: notificationType.severity ?? "default",
        author_id: notificationType.author_id ?? null,
        read: false,
    });
}

export default {
    sendUserNotification,
};
