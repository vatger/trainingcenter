import { TrainingSessionModel } from "./TrainingSessionModel";
import { UserModel } from "@/models/UserModel";

export type TrainingSessionBelongsToUserModel = {
    id: number;
    user_id: number;
    training_session_id: number;
    log_id?: number;
    passed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    training_session?: TrainingSessionModel;
    training_log?: TrainingLogModel;
};

export type TrainingLogModel = {
    id: number;
    uuid: string;
    content: object;
    log_public: boolean;
    author_id: number;
    createdAt?: Date;
    updatedAt?: Date;

    author?: UserModel;

    TrainingSessionBelongsToUsers?: TrainingSessionBelongsToUserModel;
};
