import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { UserBelongToMentorGroups } from "./through/UserBelongToMentorGroups";
import { EndorsementGroup } from "./EndorsementGroup";
import MentorGroupExtensions from "./extensions/MentorGroupExtensions";
import { MENTOR_GROUPS_TABLE_ATTRIBUTES, MENTOR_GROUPS_TABLE_NAME } from "../../db/migrations/20221115171244-create-mentor-groups-table";

export class MentorGroup extends Model<InferAttributes<MentorGroup>, InferCreationAttributes<MentorGroup>> {
    //
    // Attributes
    //
    declare name: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare fir: CreationOptional<"edww" | "edgg" | "edmm"> | null | undefined;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>;
    declare courses?: NonAttribute<Course[]>;

    //
    // Through Association Placeholders
    //
    declare UserBelongToMentorGroups?: NonAttribute<UserBelongToMentorGroups>;

    declare endorsement_groups?: NonAttribute<EndorsementGroup[]>;

    declare static associations: {
        users: Association<MentorGroup, User>;
        courses: Association<MentorGroup, Course>;
        endorsement_groups: Association<MentorGroup, EndorsementGroup>;
    };

    getEndorsementGroups = MentorGroupExtensions.getEndorsementGroups.bind(this);
}

MentorGroup.init(MENTOR_GROUPS_TABLE_ATTRIBUTES, {
    tableName: MENTOR_GROUPS_TABLE_NAME,
    sequelize: sequelize,
});
