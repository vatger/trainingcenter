import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import dayjs from "dayjs";
import JobLibrary, { JobTypeEnum } from "../../libraries/JobLibrary";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { EndorsementGroupBelongsToStations } from "../../models/through/EndorsementGroupBelongsToStations";

async function handle() {
    console.log("Handle...");

    const endorsementGroupsBelongsToUsers = await EndorsementGroupsBelongsToUsers.findAll({
        include: [EndorsementGroupsBelongsToUsers.associations.userSolo, EndorsementGroupsBelongsToUsers.associations.user],
    });

    console.log(endorsementGroupsBelongsToUsers.length);

    for (const solo of endorsementGroupsBelongsToUsers) {
        if (solo.user == null || solo.userSolo == null) continue;

        if (dayjs.utc(solo.userSolo?.current_solo_end).isBefore(dayjs.utc())) {
            console.log(`Solo ID ${solo.solo_id} [user_id = ${solo.user_id}] has expired. Removing Endorsement Group...`);

            await JobLibrary.scheduleJob(JobTypeEnum.EMAIL, {
                type: "message",
                recipient: solo.user.email,
                subject: "Entzug Solofreigabe",
                replacements: {
                    message: {
                        name: `${solo.user.first_name} ${solo.user.last_name}`,
                        message_de:
                            "Die dir zugewiesene Solophase ist vorbei. Entsprechend wurden die alle verknüpften Freigaben entzogen. Wende dich an einen Mentoren, falls Du der Meinung bist, dass es sich um einen Fehler handelt, oder um Dich zu erkundigen, wie du nun zu verfahren hast",
                        message_en: "English counterpart...",
                    },
                },
            });
            await solo.destroy();
        } else {
            console.log(
                `Solo ID ${solo.solo_id} [user_id = ${solo.user_id}] is expiring on ${dayjs.utc(solo.userSolo.current_solo_end)} (${Math.abs(
                    dayjs.utc(solo.userSolo.current_solo_end).diff(dayjs.utc(), "day")
                )} Day(s) remaining).`
            );
        }
    }
}

export default {
    handle,
};
