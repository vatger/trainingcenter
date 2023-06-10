import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingSession } from "../TrainingSession";
import { User } from "../User";
import { TrainingLog } from "../TrainingLog";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

export class TrainingSessionBelongsToUsers extends Model<
    InferAttributes<TrainingSessionBelongsToUsers>,
    InferCreationAttributes<TrainingSessionBelongsToUsers>
> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare training_session_id: ForeignKey<TrainingSession["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare log_id: CreationOptional<ForeignKey<TrainingLog["id"]>> | null;
    declare passed: CreationOptional<boolean> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_session?: NonAttribute<TrainingSession>;
    declare training_log?: NonAttribute<TrainingLog>;
    declare user?: NonAttribute<User>;

    declare static associations: {
        training_session: Association<TrainingSessionBelongsToUsers, TrainingSession>;
        training_log: Association<TrainingSessionBelongsToUsers, TrainingLog>;
        user: Association<TrainingSessionBelongsToUsers, User>;
    };
}

TrainingSessionBelongsToUsers.init(
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
        training_session_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "training_sessions",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        log_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_logs",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        passed: {
            type: DataType.BOOLEAN,
            allowNull: true,
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_session_belongs_to_users",
        sequelize: sequelize,
    }
);
