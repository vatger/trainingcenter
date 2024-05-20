import { TrainingSession } from "../TrainingSession";
import { User } from "../User";
import { Course } from "../Course";
import { MentorGroup } from "../MentorGroup";

/**
 * Checks if the user is allowed to view the training session
 * @param user
 */
function userCanRead(this: TrainingSession, user: User): boolean {
    if (user.hasPermission("atd.override")) {
        return true;
    }

    return this.mentor_id == user.id;
}

/**
 * Checks if the user is allowed to create training logs for this session
 * @param user
 */
function userCanCreateLogs(this: TrainingSession, user: User): boolean {
    if (user.hasPermission("atd.override")) {
        return true;
    }

    return this.mentor_id == user.id;
}

/**
 * Returns all available mentors that could also mentor this session.
 * (for passing the training on)
 */
async function getAvailableMentorGroups(this: TrainingSession): Promise<MentorGroup[]> {
    // TODO: Test if we can limit the attributes, without breaking the includes.

    const trainingSession = await TrainingSession.findOne({
        where: {
            uuid: this.uuid,
        },
        include: [
            {
                association: TrainingSession.associations.course,
                include: [
                    {
                        association: Course.associations.mentor_groups,
                        include: [
                            {
                                association: MentorGroup.associations.users,
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return trainingSession?.course?.mentor_groups ?? [];
}

/**
 * Checks whether the user is a participant of the training session
 * @param user
 */
function isUserParticipant(this: TrainingSession, user: User): boolean {
    return this.users?.find(participant => participant.id == user.id) != null;
}

export default {
    userCanRead,
    userCanCreateLogs,
    getAvailableMentorGroups,
    isUserParticipant,
};
