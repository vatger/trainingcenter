import { Method } from "axios";

export enum VateudCoreTypeEnum {
    SOLO_CREATE = "solo_create",
    SOLO_REMOVE = "solo_remove",
}

export type VateudCorePayload = {
    type: VateudCoreTypeEnum;
    method: Method;
    data:
        | Record<"solo_create", { local_solo_id: number; user_id: number; position: string; instructor_cid: number; expire_at: string }>
        | Record<"solo_remove", { local_solo_id: number; vateud_solo_id: number }>;
};

export type VateudCoreSoloCreateT = {
    local_solo_id: number;
    post_data: {
        user_cid: number;
        position: string;
        instructor_cid: number;
        start_at: string;
        expire_at: string;
    };
};


export type VateudCoreSoloCreateResponseT = {
    success: boolean;
    data: {
        id: number;
        user_cid: number;
        instructor_cid: number;
        expiry: string;
        max_days: number;
        position: string;
        facility: number;
        created_at: string;
        updated_at: string;
    };
};

export type VateudCoreSoloRemoveT = {
    local_solo_id: number;
    vateud_solo_id: number;
};

export type VateudCoreSoloRemoveResponseT = {
    success: boolean;
    message: string;
};

export type VateudCoreEndorsementCreateT = {
    local_id: number;
    post_data: {
        user_cid: number;
        position: string;
        instructor_cid: number;
    };
};

export type VateudCoreEndorsementCreateResponseT = {
    success: boolean;
    data: {
        id: number;
        user_cid: number;
        instructor_cid: number;
        expiry: string;
        max_days: number;
        position: string;
        facility: number;
        created_at: string;
        updated_at: string;
    };
};