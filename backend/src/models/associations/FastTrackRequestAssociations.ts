import { FastTrackRequest } from "../FastTrackRequest";
import { User } from "../User";
import Logger, { LogLevels } from "../../utility/Logger";

export function registerFastTrackRequestAssociations() {
    FastTrackRequest.hasOne(User, {
        as: "user",
        sourceKey: "user_id",
        foreignKey: "id",
    });

    FastTrackRequest.hasOne(User, {
        as: "requested_by_user",
        sourceKey: "requested_by_user_id",
        foreignKey: "id",
    });

    User.hasMany(FastTrackRequest, {
        as: "fast_track_requests",
        sourceKey: "id",
        foreignKey: "user_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[FastTrackRequestAssociations]");
}
