import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import {
    NOTIFICATION_TABLE_ATTRIBUTES,
    NOTIFICATION_TABLE_NAME,
    NOTIFICATION_TABLE_SEVERITY_TYPE,
} from "../../db/migrations/20221115171265-create-notification-table";

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
    declare severity: CreationOptional<(typeof NOTIFICATION_TABLE_SEVERITY_TYPE)[number]> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    declare user?: NonAttribute<User>;
    declare author?: NonAttribute<User>;

    declare static associations: {
        user: Association<Notification, User>;
        author: Association<Notification, User>;
    };
}

Notification.init(NOTIFICATION_TABLE_ATTRIBUTES, {
    tableName: NOTIFICATION_TABLE_NAME,
    sequelize: sequelize,
});
