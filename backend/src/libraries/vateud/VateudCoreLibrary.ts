import axios, { Method } from "axios";
import JobLibrary, { JobTypeEnum } from "../JobLibrary";
import {
    VateudCoreEndorsementCreateT,
    VateudCoreSoloCreateResponseT,
    VateudCoreSoloCreateT,
    VateudCoreSoloRemoveResponseT,
    VateudCoreTypeEnum,
} from "./VateudCoreLibraryTypes";
import { Config } from "../../core/Config";
import { UserSolo } from "../../models/UserSolo";
import Logger, { LogLevels } from "../../utility/Logger";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";

type SendT = {
    method: Method;
    endpoint: string;
    data?: any;
};

/**
 * Sends the actual request to VATEUD Core
 * @param props
 */
async function _send<T>(props: SendT): Promise<T | undefined> {
    if (Config.VATEUD_CORE_CONFIG.API_KEY == null) {
        Logger.log(LogLevels.LOG_ERROR, `VATEUD Core API Key missing, but attempted to update: ${props.endpoint}. Aborting.`);
        return undefined;
    }

    try {
        const res = await axios({
            headers: {
                "X-API-KEY": Config.VATEUD_CORE_CONFIG.API_KEY,
            },
            url: `${Config.URI_CONFIG.VATEUD_API_BASE}/${props.endpoint}`,
            method: props.method,
            data: props.data,
        });

        return res.data as T;
    } catch (e: any) {
        console.error(e);
        Logger.log(LogLevels.LOG_WARN, e);
        return undefined;
    }
}

/**
 * Creates a solo.
 * On success, it updates the corresponding UserSolo with the returned VATEUD Solo ID
 * On failure, it schedules a job which repeats the same request n times until it succeeds
 * - If it fails more than n times, then it really isn't our problem anymore tbh...
 */
export async function createSolo(userSolo: UserSolo, endorsementGroup: EndorsementGroup) {
    const soloInfo: VateudCoreSoloCreateT = {
        local_solo_id: userSolo.id,
        post_data: {
            user_cid: userSolo.user_id,
            position: endorsementGroup.name,
            instructor_cid: 1439797, //todo userSolo.created_by,
            start_at: userSolo.current_solo_start?.toISOString() ?? "",
            expire_at: userSolo.current_solo_end?.toISOString() ?? "",
        },
    };

    const res = await _send<VateudCoreSoloCreateResponseT>({
        endpoint: "facility/endorsements/solo",
        method: "post",
        data: soloInfo.post_data,
    });
    if (!res) {
        // If the request fails, we schedule a job to attempt it additional times.
        await JobLibrary.scheduleJob(JobTypeEnum.VATEUD_CORE, {
            type: VateudCoreTypeEnum.SOLO_CREATE,
            method: "post",
            data: {
                solo_create: {
                    local_solo_id: soloInfo.local_solo_id,
                    user_id: soloInfo.post_data.user_cid,
                    position: soloInfo.post_data.position,
                    instructor_cid: soloInfo.post_data.instructor_cid,
                    expire_at: soloInfo.post_data.expire_at,
                },
            },
        });
        return undefined;
    }

    await UserSolo.update(
        {
            vateud_solo_id: res.data.id,
        },
        {
            where: {
                id: soloInfo.local_solo_id,
            },
        }
    );

    return res;
}

/**
 * Removes a solo.
 * On failure, it schedules a job which repeats the same request n times until it succeeds
 */
export async function removeSolo(userSolo: UserSolo) {
    const res = await _send<VateudCoreSoloRemoveResponseT>({
        endpoint: `facility/endorsements/solo/${userSolo.vateud_solo_id}`,
        method: "delete",
    });

    if (!userSolo.vateud_solo_id) return;

    if (!res) {
        await JobLibrary.scheduleJob(JobTypeEnum.VATEUD_CORE, {
            type: VateudCoreTypeEnum.SOLO_REMOVE,
            method: "delete",
            data: {
                solo_remove: {
                    local_solo_id: userSolo.id,
                    vateud_solo_id: userSolo.vateud_solo_id,
                },
            },
        });
    }
}

/**
 * Creates a Tier 1 or 2 endorsement.
 * On success, it updates the corresponding endorsement with the returned VATEUD ID
 */
export async function createEndorsement(userEndorsement: EndorsementGroupsBelongsToUsers, endorsementGroup: EndorsementGroup | null) {

    if(!Config.VATEUD_CORE_CONFIG.USE) {
        return true;
    }

    if (!endorsementGroup) return false;
    const endorsementInfo: VateudCoreEndorsementCreateT = {
        local_id: userEndorsement.id,
        post_data: {
            user_cid: userEndorsement.user_id,
            position: endorsementGroup.name,
            instructor_cid: 1439797, //todo userEndorsement.created_by,
        },
    };

    const res = await _send<VateudCoreSoloCreateResponseT>({
        endpoint: `facility/endorsements/tier-${endorsementGroup.tier}`,
        method: "post",
        data: endorsementInfo.post_data,
    });

    if (!res) {
        return false;
    }

    await EndorsementGroupsBelongsToUsers.update(
        {
            vateud_id: res.data.id,
        },
        {
            where: {
                id: userEndorsement.id,
            },
        }
    );

    return true;
}

/**
 * Removes a Tier 1 or 2 endorsement.
 * On success, it updates the corresponding endorsement
 */
export async function removeEndorsement(userEndorsement: EndorsementGroupsBelongsToUsers | null, endorsementGroup: EndorsementGroup | null) {
    if (!endorsementGroup || !userEndorsement) return false;
    if (!userEndorsement.vateud_id) return true;

    const res = await _send<VateudCoreSoloRemoveResponseT>({
        endpoint: `facility/endorsements/tier-${endorsementGroup.tier}/${userEndorsement.vateud_id}`,
        method: "delete",
    });

    if (!res) return false;

    await EndorsementGroupsBelongsToUsers.update(
        {
            vateud_id: null,
        },
        {
            where: {
                id: userEndorsement.id,
            },
        }
    );

    return true;
}
