import { User } from "../User";
import { EndorsementGroup } from "../EndorsementGroup";
import { EndorsementGroupsBelongsToUsers } from "../through/EndorsementGroupsBelongsToUsers";
import Logger, { LogLevels } from "../../utility/Logger";
import { TrainingStation } from "../TrainingStation";
import { EndorsementGroupBelongsToStations } from "../through/EndorsementGroupBelongsToStations";
import { UserSolo } from "../UserSolo";

export function registerEndorsementGroupAssociations() {
    User.belongsToMany(EndorsementGroup, {
        as: "endorsement_groups",
        through: EndorsementGroupsBelongsToUsers,
        foreignKey: "user_id",
        otherKey: "endorsement_group_id",
    });

    EndorsementGroup.belongsToMany(User, {
        as: "users",
        through: EndorsementGroupsBelongsToUsers,
        foreignKey: "endorsement_group_id",
        otherKey: "user_id",
    });

    EndorsementGroup.belongsToMany(TrainingStation, {
        as: "stations",
        through: EndorsementGroupBelongsToStations,
        foreignKey: "endorsement_group_id",
        otherKey: "station_id",
    });

    TrainingStation.belongsToMany(EndorsementGroup, {
        as: "endorsement_groups",
        through: EndorsementGroupBelongsToStations,
        foreignKey: "station_id",
        otherKey: "endorsement_group_id",
    });

    EndorsementGroupsBelongsToUsers.belongsTo(User, {
        as: "user",
        foreignKey: "user_id",
        targetKey: "id",
    });

    EndorsementGroupsBelongsToUsers.hasOne(UserSolo, {
        as: "userSolo",
        foreignKey: "id",
        sourceKey: "solo_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[EndorsementGroupAssociations]");
}
