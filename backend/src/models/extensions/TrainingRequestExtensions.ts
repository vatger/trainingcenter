import { TrainingRequest } from "../TrainingRequest";
import { User } from "../User";

async function canUserView(this: TrainingRequest, user: User): Promise<boolean> {
    if (await user.isMentor()) return true;

    return this.user_id == user.id;
}

export default {
    canUserView
}