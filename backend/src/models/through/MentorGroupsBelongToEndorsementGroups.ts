import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../core/Sequelize";
import { EndorsementGroup } from "../EndorsementGroup";
import {
    MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_ATTRIBUTES,
    MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_NAME,
} from "../../../db/migrations/20221115171258-create-mentor-group-belongs-to-endorsement-group-table";

export class MentorGroupsBelongToEndorsementGroups extends Model<
    InferAttributes<MentorGroupsBelongToEndorsementGroups>,
    InferCreationAttributes<MentorGroupsBelongToEndorsementGroups>
> {
    //
    // Attributes
    //
    declare endorsement_group_id: ForeignKey<EndorsementGroup["id"]>;
    declare mentor_group_id: ForeignKey<EndorsementGroup["id"]>;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

MentorGroupsBelongToEndorsementGroups.init(MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_ATTRIBUTES, {
    tableName: MENTOR_GROUP_BELONGS_TO_ENDORSEMENT_GROUP_TABLE_NAME,
    sequelize: sequelize,
});
