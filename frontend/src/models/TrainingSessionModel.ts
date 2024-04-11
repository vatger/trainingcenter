import { TrainingLogModel, TrainingSessionBelongsToUserModel } from "./TrainingSessionBelongsToUser.model";
import { TrainingTypeModel } from "./TrainingTypeModel";
import { CourseModel } from "./CourseModel";
import { TrainingStationModel } from "./TrainingStationModel";
import { UserModel } from "./UserModel";
import { CptSessionModel } from "@/models/CptSessionModel";

export interface TrainingSessionModel {
    id: number;
    uuid: string;
    completed?: boolean;
    mentor_id?: number;
    date: Date;
    training_type_id: number;
    training_station_id?: number;
    cpt_session_id?: number;
    course_id: number;
    createdAt?: Date;
    updatedAt?: Date;

    users?: UserModel[];
    mentor?: UserModel;
    cpt?: CptSessionModel;
    training_logs?: TrainingLogModel[];
    training_type?: TrainingTypeModel;
    training_station?: TrainingStationModel;
    course?: CourseModel;

    user_passed?: boolean;

    through?: any;

    training_session_belongs_to_users?: TrainingSessionBelongsToUserModel[];
}

export interface UserTrainingSessionModel extends Omit<TrainingSessionModel, "training_session_belongs_to_users"> {
    training_session_belongs_to_users?: TrainingSessionBelongsToUserModel;
}
