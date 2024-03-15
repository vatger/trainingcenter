import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../../core/Sequelize";
import { UserSolo } from "../UserSolo";
import { User } from "../User";
import { EndorsementGroup } from "../EndorsementGroup";
import {
    ENDORSEMENT_GROUPS_BELONGTO_USERS_TABLE_ATTRIBUTES,
    ENDORSEMENT_GROUPS_BELONGTO_USERS_TABLE_NAME,
} from "../../../db/migrations/20221115171255-create-endorsement-groups-belongto-users-table";

export class EndorsementGroupsBelongsToUsers extends Model<
    InferAttributes<EndorsementGroupsBelongsToUsers>,
    InferCreationAttributes<EndorsementGroupsBelongsToUsers>
> {
    //
    // Attributes
    //
    declare endorsement_group_id: ForeignKey<EndorsementGroup["id"]>;
    declare user_id: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare solo_id: CreationOptional<ForeignKey<UserSolo["id"]>> | null;
    declare created_by: CreationOptional<ForeignKey<User["id"]>>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>;
    declare userSolo?: NonAttribute<UserSolo>;

    declare static associations: {
        user: Association<EndorsementGroupsBelongsToUsers, User>;
        userSolo: Association<EndorsementGroupsBelongsToUsers, UserSolo>;
    };
}

EndorsementGroupsBelongsToUsers.init(ENDORSEMENT_GROUPS_BELONGTO_USERS_TABLE_ATTRIBUTES, {
    tableName: ENDORSEMENT_GROUPS_BELONGTO_USERS_TABLE_NAME,
    sequelize: sequelize,
});
