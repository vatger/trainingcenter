import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { User } from "../User";
import { MentorGroup } from "../MentorGroup";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

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
    declare id: CreationOptional<number> | null;
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

UserBelongToMentorGroups.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataType.INTEGER,
            comment: "User ID (CID)",
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        group_id: {
            type: DataType.INTEGER,
            comment: "Mentor-Group ID",
            allowNull: false,
            references: {
                model: "mentor_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        group_admin: {
            type: DataType.BOOLEAN,
            comment: "If true, the member can edit this mentor group's information such as name, members, etc.",
            allowNull: false,
        },
        can_manage_course: {
            type: DataType.BOOLEAN,
            comment:
                "If true, the member can edit courses associated to this mentor group assuming the can_edit_course flag is set on mentor_groups_belong_to_courses. This is to allow multiple mentor groups 'owning' a course, but only one being able to edit the courses. Especially for LM / Mentor of an area/airport.",
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "users_belong_to_mentor_groups",
        sequelize: sequelize,
    }
);
