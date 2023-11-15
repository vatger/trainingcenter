import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { UserSolo } from "../UserSolo";
import { User } from "../User";
import {EndorsementGroup} from "../EndorsementGroup";

export class MentorGroupsBelongToEndorsementGroups extends Model<
    InferAttributes<MentorGroupsBelongToEndorsementGroups>,
    InferCreationAttributes<MentorGroupsBelongToEndorsementGroups>
> {
    //
    // Attributes
    //
    declare endorsement_group_id: ForeignKey<EndorsementGroup['id']>;
    declare mentor_group_id: ForeignKey<EndorsementGroup['id']>;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

MentorGroupsBelongToEndorsementGroups.init(
    {
        endorsement_group_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "endorsement_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        mentor_group_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "mentor_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "mentor_groups_belong_to_endorsement_groups",
        sequelize: sequelize,
    }
);
