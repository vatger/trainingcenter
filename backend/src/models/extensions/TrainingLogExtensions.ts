import { TrainingLog } from "../TrainingLog";
import { User } from "../User";
import { TrainingSessionBelongsToUsers } from "../through/TrainingSessionBelongsToUsers";

/**
 * Checks if the given user is permitted to read this training log
 * @param user
 */
async function userCanRead(this: TrainingLog, user: User) {
    if (await user.isMentor()) {
        return true;
    }

    if (
        (await TrainingSessionBelongsToUsers.count({
            where: {
                log_id: this.id,
                user_id: user.id,
            },
        })) == 0
    ) {
        return false;
    }

    return true;
}

export default {
    userCanRead,
};
