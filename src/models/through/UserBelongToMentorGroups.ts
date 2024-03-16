import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { User } from "../User";
import { MentorGroup } from "../MentorGroup";
import { sequelize } from "../../core/Sequelize";
import {
    USER_BELONGS_TO_MENTOR_GROUP_TABLE_ATTRIBUTES,
    USER_BELONGS_TO_MENTOR_GROUP_TABLE_NAME,
} from "../../../db/migrations/20221115171245-create-user-belongs-to-mentor-group-table";

export class UserBelongToMentorGroups extends Model<InferAttributes<UserBelongToMentorGroups>, InferCreationAttributes<UserBelongToMentorGroups>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare group_id: ForeignKey<MentorGroup["id"]>;
    declare group_admin: boolean;
    declare can_manage_course: boolean;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare mentor_group?: NonAttribute<MentorGroup>;

    declare static associations: {
        mentor_group: Association<UserBelongToMentorGroups, MentorGroup>;
    };
}

UserBelongToMentorGroups.init(USER_BELONGS_TO_MENTOR_GROUP_TABLE_ATTRIBUTES, {
    tableName: USER_BELONGS_TO_MENTOR_GROUP_TABLE_NAME,
    sequelize: sequelize,
});
