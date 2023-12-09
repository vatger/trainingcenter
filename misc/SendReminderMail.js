/**
 * This script sends a mail to all users that have an open training request which is about to expire
 * If the expiration date is within a week. Will send up to one E-Mail per week for the next 4 weeks after the expiration.
 * All requests that have expired will be removed automatically.
 */
const DBConn = require("./DBConn");
const Sequelize = require("sequelize");
const dayjs = require("dayjs");

DBConn.connectToDatabase()
.then(async (seq) => {
    if (seq == null) return;

    const now = dayjs.utc();

    const q = await seq.query(`SELECT * FROM training_requests WHERE status = 'requested' AND expires <= ?`, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [now.format('YYYY-MM-DD').toString()]
    });

    // TODO: Add DB to store all the reminder E-Mail Dates.
    // This is to ensure we only send one mail per Week
    // In the backend, we can then delete all those corresponding to the request UUID :)

    q.forEach(request => {
        console.log(`Sending Mail to ${request.user_id} with UUID: ${request.uuid}. Expired on: ${request.expires}`);
        console.log(btoa(`${request.uuid}.${request.user_id}.${dayjs.utc(request.expires).unix()}`))
    });

    await seq.close();
})