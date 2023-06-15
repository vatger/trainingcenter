import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { TrainingStation } from "./TrainingStation";
import { Course } from "./Course";
import { TrainingLogTemplate } from "./TrainingLogTemplate";
import { User } from "./User";

export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare user_id: ForeignKey<User["id"]>;
    declare content_de: string;
    declare content_en: string;
    declare read: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare author_id: CreationOptional<ForeignKey<User["id"]>> | null;
    declare link: CreationOptional<string> | null;
    declare icon: CreationOptional<string> | null;
    declare severity: CreationOptional<"default" | "info" | "success" | "danger"> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    declare user?: NonAttribute<User>;
    declare author?: NonAttribute<User>;

    declare static associations: {
        user: Association<Notification, User>;
        author: Association<Notification, User>;
    };
}

Notification.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataType.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        author_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "user",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "setNull",
        },
        content_de: {
            type: DataType.TEXT("medium"),
            allowNull: false,
        },
        content_en: {
            type: DataType.TEXT("medium"),
            allowNull: false,
        },
        link: {
            type: DataType.STRING(255),
            allowNull: true,
        },
        icon: {
            type: DataType.STRING(50),
            allowNull: true,
        },
        severity: {
            type: DataType.ENUM("default", "info", "success", "danger"),
            allowNull: true,
        },
        read: {
            type: DataType.BOOLEAN,
            allowNull: false,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "notifications",
        sequelize: sequelize,
    }
);
