import { UserModel } from "@/models/UserModel";

export type UserSessionModel = {
    id: number;
    uuid: string;
    browser_uuid: string;
    client?: string;
    user_id: number;
    expires_at: Date;
    expires_latest: Date;
    createdAt?: Date;
    updatedAt?: Date;

    user?: UserModel;
};
