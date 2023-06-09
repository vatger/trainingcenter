import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { MentorGroup } from "../MentorGroup";
import { Course } from "../Course";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

export class MentorGroupsBelongsToCourses extends Model<InferAttributes<MentorGroupsBelongsToCourses>, InferCreationAttributes<MentorGroupsBelongsToCourses>> {
    //
    // Attributes
    //
    declare mentor_group_id: ForeignKey<MentorGroup["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare can_edit_course: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

MentorGroupsBelongsToCourses.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        mentor_group_id: {
            type: DataType.INTEGER,
            comment: "Mentor group ID.",
            allowNull: false,
            references: {
                model: "mentor_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        course_id: {
            type: DataType.INTEGER,
            comment: "Course ID.",
            allowNull: false,
            references: {
                model: "courses",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        can_edit_course: {
            type: DataType.BOOLEAN,
            comment:
                "If true, ALL users of this mentor group can edit the course assuming the can_manage_course flag is set for the user on users_belong_to_mentor_groups.",
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "mentor_groups_belong_to_courses",
        sequelize: sequelize,
    }
);
