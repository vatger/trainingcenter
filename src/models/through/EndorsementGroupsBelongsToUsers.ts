import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

const ratingEnum = ["s1", "s2", "s3", "c1", "c3"];

export class EndorsementGroupsBelongsToUsers extends Model<
    InferAttributes<EndorsementGroupsBelongsToUsers>,
    InferCreationAttributes<EndorsementGroupsBelongsToUsers>
> {
    //
    // Attributes
    //
    declare id: number;
    declare endorsement_group_id: number;
    declare user_id: number;
    declare solo: boolean;

    //
    // Optional Attributes
    //
    declare solo_rating: CreationOptional<"s1" | "s2" | "s3" | "c1" | "c3"> | null;
    declare solo_expires: CreationOptional<Date> | null;
    declare solo_extension_count: CreationOptional<number> | null;
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
        solo: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        solo_rating: {
            type: DataType.ENUM(...ratingEnum),
            allowNull: false,
        },
        solo_expires: {
            type: DataType.DATE,
        },
        solo_extension_count: {
            type: DataType.INTEGER,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "endorsement_groups_belong_to_users",
        sequelize: sequelize,
    }
);
