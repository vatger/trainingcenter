import { User } from "../User";
import { UserBelongToMentorGroups } from "../through/UserBelongToMentorGroups";
import { MentorGroup } from "../MentorGroup";
import Logger, { LogLevels } from "../../utility/Logger";
import {EndorsementGroup} from "../EndorsementGroup";
import {MentorGroupsBelongToEndorsementGroups} from "../through/MentorGroupsBelongToEndorsementGroups";

export function registerMentorGroupAssociations() {
    User.belongsToMany(MentorGroup, {
        as: "mentor_groups",
        through: UserBelongToMentorGroups,
        foreignKey: "user_id",
        otherKey: "group_id",
    });

    MentorGroup.belongsToMany(User, {
        as: "users",
        through: UserBelongToMentorGroups,
        foreignKey: "group_id",
        otherKey: "user_id",
    });

    UserBelongToMentorGroups.hasOne(MentorGroup, {
        as: "mentor_group",
        foreignKey: "id",
        sourceKey: "group_id",
    });

    MentorGroup.belongsToMany(EndorsementGroup, {
        as: "endorsement_groups",
        through: MentorGroupsBelongToEndorsementGroups,
        foreignKey: "mentor_group_id",
        otherKey: "endorsement_group_id"
    });

    EndorsementGroup.belongsToMany(MentorGroup, {
        as: "mentor_groups",
        through: MentorGroupsBelongToEndorsementGroups,
        foreignKey: "endorsement_group_id",
        otherKey: "mentor_group_id"
    });

    Logger.log(LogLevels.LOG_INFO, "[MentorGroupAssociations]");
}
