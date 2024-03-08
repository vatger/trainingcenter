import { Job } from "../models/Job";
import { generateUUID } from "../utility/UUID";

export type EMailTypes = "message" | "reminder";
export type EMailPayload = {
    type: EMailTypes; // Corresponds to records defining replacements for each type of mail
    recipient: string;
    subject: string;
    replacements:
        | Record<"message", { message_de: string; message_en: string; name: string }>
        | Record<"reminder", { name: string; expiry_date: string; link: string }>;
};

export enum JobTypeEnum {
    EMAIL = "email",
}

async function scheduleJob(type: JobTypeEnum, payload: EMailPayload) {
    try {
        await Job.create({
            uuid: generateUUID(),
            job_type: type,
            payload: JSON.stringify(payload),
            attempts: 0,
            status: "queued",
        });
        return true;
    } catch (e) {
        return false;
    }
}

async function getQueuedJobsByType(type: "email") {
    return await Job.findAll({
        where: {
            status: "queued",
            job_type: type,
        },
    });
}

export default {
    scheduleJob,
    getQueuedJobsByType,
};
