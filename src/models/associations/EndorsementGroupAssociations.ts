import { User } from "../User";
import { EndorsementGroup } from "../EndorsementGroup";
import { EndorsementGroupsBelongsToUsers } from "../through/EndorsementGroupsBelongsToUsers";
import Logger, { LogLevels } from "../../utility/Logger";

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

    Logger.log(LogLevels.LOG_INFO, "[EndorsementGroupAssociations]");
}
