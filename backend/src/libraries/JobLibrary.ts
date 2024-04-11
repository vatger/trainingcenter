import { Job } from "../models/Job";
import { generateUUID } from "../utility/UUID";
import { EMailPayload } from "./EmailLibrary";
import { VateudCorePayload } from "./vateud/VateudCoreLibraryTypes";

export enum JobTypeEnum {
    EMAIL = "email",
    VATEUD_CORE = "vateud_core",
}

async function scheduleJob(type: JobTypeEnum, payload: EMailPayload | VateudCorePayload) {
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
