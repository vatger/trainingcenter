import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { UserSolo } from "../UserSolo";
import { User } from "../User";

export class EndorsementGroupsBelongsToUsers extends Model<
    InferAttributes<EndorsementGroupsBelongsToUsers>,
    InferCreationAttributes<EndorsementGroupsBelongsToUsers>
> {
    //
    // Attributes
    //
    declare endorsement_group_id: number;
    declare user_id: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare solo_id: CreationOptional<ForeignKey<UserSolo["id"]>> | null;
    declare created_by: CreationOptional<ForeignKey<User["id"]>>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

EndorsementGroupsBelongsToUsers.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        endorsement_group_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "endorsement_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        created_by: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
        },
        solo_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "user_solos",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
            // The solo is only ever deleted IFF a rating change has taken place.
            // Therefore, we can just set it null to indicate that the solo is over.
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "endorsement_groups_belong_to_users",
        sequelize: sequelize,
    }
);
