import { Notification } from "../../models/Notification";
import { generateUUID } from "../../utility/UUID";

async function sendUserNotification(user_id: number, message_de: string, message_en: string, author_id?: number, link?: string) {
    await Notification.create({
        uuid: generateUUID(),
        user_id: user_id,
        content_de: message_de,
        content_en: message_en,
        link: link ?? null,
        author_id: author_id ?? null,
        read: false,
    });
}

export default {
    sendUserNotification,
};
