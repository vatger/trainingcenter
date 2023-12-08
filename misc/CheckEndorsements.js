const Config = require("../dist/core/Config");
const Sequelize = require("sequelize");
const dayjs = require("dayjs");

/**
 * This script periodically checks, if a user has an endorsement bound to a solo, whilst the solo has already passed
 * Once every 24 Hours.
 */
const newConf = {
    ...Config.SequelizeConfig,
    logging: message => {
        console.log(message);
    },
};
const seq = new Sequelize(newConf);
seq.authenticate().catch(() => {
    console.log("[SEQ] Failed to authenticate...");
});

seq.query(
    "SELECT endorsement_groups_belong_to_users.id, endorsement_groups_belong_to_users.user_id, endorsement_groups_belong_to_users.solo_id, user_solos.current_solo_start, user_solos.current_solo_end FROM endorsement_groups_belong_to_users JOIN user_solos ON user_solos.id = endorsement_groups_belong_to_users.solo_id",
    {
        type: Sequelize.QueryTypes.SELECT,
    }
)
    .then(res => {
        res.forEach(async solo => {
            if (dayjs.utc(solo.current_solo_end).isBefore(dayjs.utc())) {
                console.log(`Solo ID ${solo.solo_id} has expired. Removing Endorsement Group...`);
            } else {
                console.log(
                    `Solo ID ${solo.solo_id} is expiring on ${dayjs.utc(solo.current_solo_end)} (${Math.abs(
                        dayjs.utc(solo.current_solo_end).diff(dayjs.utc(), "day")
                    )} Day(s) remaining).`
                );
            }

            await seq.query("DELETE FROM endorsement_groups_belong_to_users WHERE ID = ?", { replacements: [solo.id], type: Sequelize.QueryTypes.DELETE });
        });
    })
    .finally(async () => {
        await seq.close();
    });
