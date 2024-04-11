import { UserModel } from "./UserModel";
import { TrainingTypeModel } from "./TrainingTypeModel";
import { TrainingSessionModel } from "./TrainingSessionModel";
import { TrainingStationModel } from "./TrainingStationModel";
import { CourseModel } from "./CourseModel";

type TrainingRequestStatusType = "requested" | "planned" | "cancelled" | "completed";

export type TrainingRequestModel = {
    id: number;
    uuid: string;
    user_id: number;
    training_type_id: number;
    course_id: number;
    comment: string;
    status: TrainingRequestStatusType;
    number_in_queue: number | undefined;
    expires: Date;
    createdAt?: Date;
    updatedAt?: Date;

    training_session_id?: number;

    user?: UserModel;
    training_type?: TrainingTypeModel;
    course?: CourseModel;
    training_session?: TrainingSessionModel;
    training_station?: TrainingStationModel;
};
