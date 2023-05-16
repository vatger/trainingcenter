import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";

export class FastTrackRequest extends Model<InferAttributes<FastTrackRequest>, InferCreationAttributes<FastTrackRequest>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare requested_by_user_id: ForeignKey<User["id"]>;
    declare status: number;
    declare rating: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare file_name: CreationOptional<string> | null;
    declare comment: CreationOptional<string> | null;
    declare response: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>; // User
    declare requested_by_user?: NonAttribute<User>; // Requested by

    declare static associations: {
        user: Association<FastTrackRequest, User>;
        requested_by_user: Association<FastTrackRequest, User>;
    };
}

FastTrackRequest.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        requested_by_user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        status: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        file_name: {
            type: DataType.STRING,
            allowNull: false,
        },
        comment: {
            type: DataType.TEXT,
            allowNull: true,
        },
        response: {
            type: DataType.TEXT,
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "fast_track_requests",
        sequelize: sequelize,
    }
);
