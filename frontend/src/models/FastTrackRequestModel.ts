import { UserModel } from "@/models/UserModel";

export type FastTrackRequestModel = {
    id: number;
    user_id: number;
    requested_by_user_id: number;
    status: number;
    rating: number;
    file_name: string;
    comment?: string;
    response?: string;
    createdAt: Date;
    updatedAt?: Date;

    user?: UserModel;
    requested_by_user?: UserModel;
};
