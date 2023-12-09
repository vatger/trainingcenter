const Sequelize = require("sequelize");
const dayjs = require("dayjs");
const DBConn = require("./DBConn");

/**
 * This script periodically checks, if a user has an endorsement bound to a solo, whilst the solo has already passed
 * Once every 24 Hours.
 */

DBConn.connectToDatabase()
.then(async (seq) => {
    if (seq == null) return;

    const q = seq.query(
        "SELECT endorsement_groups_belong_to_users.id, endorsement_groups_belong_to_users.user_id, endorsement_groups_belong_to_users.solo_id, user_solos.current_solo_start, user_solos.current_solo_end FROM endorsement_groups_belong_to_users JOIN user_solos ON user_solos.id = endorsement_groups_belong_to_users.solo_id",
        {
            type: Sequelize.QueryTypes.SELECT,
        }
    )

    for (const solo of q) {
        if (dayjs.utc(solo.current_solo_end).isBefore(dayjs.utc())) {
            console.log(`Solo ID ${solo.solo_id} [user_id = ${solo.user_id}] has expired. Removing Endorsement Group...`);
            await seq.query("DELETE FROM endorsement_groups_belong_to_users WHERE ID = ?", {
                replacements: [solo.id],
                type: Sequelize.QueryTypes.DELETE
            });
        } else {
            console.log(
                `Solo ID ${solo.solo_id} [user_id = ${solo.user_id}] is expiring on ${dayjs.utc(solo.current_solo_end)} (${Math.abs(
                    dayjs.utc(solo.current_solo_end).diff(dayjs.utc(), "day")
                )} Day(s) remaining).`
            );
        }
    }

    await seq.close();
});
