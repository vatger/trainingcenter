import { TrainingStationModel } from "@/models/TrainingStationModel";
import { UserSoloModel } from "@/models/UserModel";

export interface EndorsementGroupModel {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt?: Date;

    stations?: TrainingStationModel[];

    EndorsementGroupsBelongsToUsers?: EndorsementGroupsBelongsToUsers;
}

export interface EndorsementGroupsBelongsToUsers {
    id: number;
    endorsement_group_id: number;
    user_id: number;
    solo_id?: number;
    createdAt: Date;
    updatedAt?: Date;

    solo?: UserSoloModel;
}
