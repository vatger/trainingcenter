import JobLibrary from "../../libraries/JobLibrary";
import EmailLibrary, { EMailPayload, EMailTypes } from "../../libraries/EmailLibrary";
import dayjs from "dayjs";

// This file maps between the type of the email and the corresponding html file used to actually render the template
const typeToFile = new Map<EMailTypes, string>([
    ["message", "message.html"],
    ["reminder", "reminder.html"],
]);

/**
 * Retrieves all email jobs that are still queued and attempts to send the emails sequentially.
 */
async function handle() {
    const emails = await JobLibrary.getQueuedJobsByType("email");

    for (const email of emails) {
        const payload: EMailPayload = JSON.parse(<string>email.payload);
        const fileName = typeToFile.get(payload.type)!;

        let update: any = { attempts: email.attempts + 1, last_executed: dayjs.utc().toDate() };
        if (
            !(await EmailLibrary.sendMail({
                recipient: payload.recipient,
                subject: payload.subject,
                fileName: fileName,
                replacements: (<any>payload.replacements)[payload.type],
            }))
        ) {
            if (email.attempts == 3) {
                update.status = "failed";
            }
        } else {
            update.status = "completed";
        }
        await email.update(update);
    }
}

export default {
    handle,
};