import { UserModel } from "@/models/UserModel";

export interface CptSessionModel {
    id: number;
    examiner_id: number;
    atsim_passed: boolean;
    log_file_name?: string;
    createdAt: Date;
    updatedAt?: Date;

    examiner?: UserModel;
}
