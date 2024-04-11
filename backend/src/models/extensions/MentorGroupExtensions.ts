import { MentorGroup } from "../MentorGroup";
import { EndorsementGroup } from "../EndorsementGroup";

/**
 * Gets all the endorsement groups associated to this
 */
async function getEndorsementGroups(this: MentorGroup): Promise<EndorsementGroup[]> {
    const m = await MentorGroup.findOne({
        where: {
            id: this.id,
        },
        include: [
            {
                association: MentorGroup.associations.endorsement_groups,
                through: {
                    attributes: [],
                },
            },
        ],
    });

    return m?.endorsement_groups ?? [];
}

export default {
    getEndorsementGroups,
};
