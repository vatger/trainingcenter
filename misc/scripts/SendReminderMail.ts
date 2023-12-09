/**
 * This script sends a mail to all users that have an open training request which is about to expire
 * If the expiration date is within a week. Will send up to one E-Mail per week for the next 4 weeks after the expiration.
 * All requests that have expired will be removed automatically.
 */

import DBConn from "./DBConn";
import dayjs from "dayjs";
import { QueryTypes } from "sequelize";
import { Config } from "../../src/core/Config";
import EmailHelper from "../../src/utility/helper/EmailHelper";

DBConn.connectToDatabase().then(async seq => {
    if (seq == null) return;

    const now = dayjs.utc();

    const query = (await seq.query(
        `SELECT TR.id AS id, uuid, user_id, status, expires, first_name, last_name FROM training_requests as TR JOIN users U ON U.id = TR.user_id WHERE status = 'requested' AND expires <= ?`,
        {
            type: QueryTypes.SELECT,
            replacements: [now.format("YYYY-MM-DD").toString()],
        }
    )) as any[];

    // TODO: Add DB to store all the reminder E-Mail Dates.
    // This is to ensure we only send one mail per Week
    // In the backend, we can then delete all those corresponding to the request UUID :)

    for (const request of query) {
        const token = btoa(`${request.uuid}.${request.user_id}.${dayjs.utc(request.expires).unix()}`);
        let replacements = {
            name: request.first_name + " " + request.last_name,
            expiry_date: dayjs.utc().format(Config.DATE_FORMAT),
            link: `${Config.FRONTEND_URI}/confirm-interest?token=${token}`,
            date_now: dayjs.utc().format(Config.DATETIME_FORMAT),
        };

        await EmailHelper.sendMail(
            Config.APP_DEBUG ? Config.DEBUG_EMAIL : request.email,
            "Weiteres Interesse an Trainings",
            "reminder.html",
            replacements,
            true
        );
    }

    await seq.close();
});
