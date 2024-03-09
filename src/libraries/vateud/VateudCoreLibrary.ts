import axios, {Method} from "axios";
import JobLibrary, {JobTypeEnum} from "../JobLibrary";
import {VateudCoreSoloCreateResponse, VateudCoreSoloCreateT, VateudCoreTypeEnum} from "./VateudCoreLibraryTypes";
import {Config} from "../../core/Config";

type SendT = {
    method: Method;
    endpoint: string;
    data: any;
}

/**
 * Sends the actual request to VATEUD Core
 * @param props
 * @param type
 */
async function _send<T>(props: SendT, type: VateudCoreTypeEnum): Promise<T | undefined> {
    try {
        const res = await axios({
            url: `${Config.URI_CONFIG.VATEUD_API_BASE}/${props.endpoint}`,
            method: props.method,
            data: props.data
        });

        return res.data as T;
    } catch (e) {
        return undefined;
    }
}

async function createSolo(soloInfo: VateudCoreSoloCreateT) {
    const res = await _send<VateudCoreSoloCreateResponse>({
        endpoint: "/solo",
        method: "post",
        data: soloInfo
    }, VateudCoreTypeEnum.SOLO_CREATE);
    if (!res) {
        // If the request fails, we schedule a job to attempt it additional times.
        await JobLibrary.scheduleJob(JobTypeEnum.VATEUD_CORE, {
            type: VateudCoreTypeEnum.SOLO_CREATE,
            method: "post",
            data: {
                solo_create: {
                    local_solo_id: soloInfo.local_solo_id,
                    user_id: soloInfo.user_id,
                    position: soloInfo.position,
                    instructor_cid: soloInfo.instructor_cid,
                    expire_at: soloInfo.expires_at
                }
            }
        });
        return undefined;
    }

    return res;
}