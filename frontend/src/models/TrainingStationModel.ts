import { TrainingRequestModel } from "./TrainingRequestModel";

export type TrainingStationModel = {
    id: number;
    callsign: string;
    frequency: number;
    gcap_class: number;
    gcap_class_group: string;
    gcap_training_airport: boolean;
    s1_twr: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    training_requests?: TrainingRequestModel[];
};
