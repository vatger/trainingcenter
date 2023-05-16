import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Permission } from "./Permission";
import { User } from "./User";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    //
    // Attributes
    //
    declare name: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>;
    declare permissions?: NonAttribute<Permission[]>;

    declare static associations: {
        users: Association<Role, User>;
        permissions: Association<Role, Permission>;
    };
}

Role.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataType.STRING(70),
            allowNull: false,
            unique: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "roles",
        sequelize: sequelize,
    }
);
