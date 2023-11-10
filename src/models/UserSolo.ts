import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, Association, NonAttribute } from "sequelize";
import { User } from "./User";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";

export class UserSolo extends Model<InferAttributes<UserSolo>, InferCreationAttributes<UserSolo>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare solo_used: number;
    declare extension_count: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare created_by: CreationOptional<ForeignKey<User["id"]>>;
    declare current_solo_start: CreationOptional<Date> | null;
    declare current_solo_end: CreationOptional<Date> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association Placeholders
    //
    declare user?: NonAttribute<Association<UserSolo, User>>;
    declare solo_creator?: NonAttribute<Association<UserSolo, User>>;

    declare static associations: {
        user: Association<UserSolo, User>;
        solo_creator: Association<UserSolo, User>;
    };
}

UserSolo.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            unique: true,
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
        solo_used: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        extension_count: {
            type: DataType.INTEGER,
            allowNull: false,
        },
        current_solo_start: {
            type: DataType.DATE,
            allowNull: true,
        },
        current_solo_end: {
            type: DataType.DATE,
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "user_solos",
        sequelize: sequelize,
    }
);
