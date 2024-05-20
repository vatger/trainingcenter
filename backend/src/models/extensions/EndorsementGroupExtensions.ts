import { EndorsementGroup } from "../EndorsementGroup";
import { User } from "../User";

/**
 * Checks if the user can endorse this specific endorsement group (i.e. is a member of the mentor group which holds this endorsement group)
 * @param user
 */
async function userCanEndorse(this: EndorsementGroup, user: User) {
    const mentorGroups = await user.getMentorGroupsAndEndorsementGroups();

    for (const mentorGroup of mentorGroups) {
        for (const endorsementGroup of mentorGroup.endorsement_groups ?? []) {
            if (endorsementGroup.id == this.id) return true;
        }
    }

    return false;
}

export default {
    userCanEndorse,
};
