import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingSession } from "../TrainingSession";
import { User } from "../User";
import { TrainingLog } from "../TrainingLog";
import { sequelize } from "../../core/Sequelize";
import {
    TRAINING_SESSION_BELONGS_TO_USER_TABLE_ATTRIBUTES,
    TRAINING_SESSION_BELONGS_TO_USER_TABLE_NAME,
} from "../../../db/migrations/20221115171258-create-training-session-belongs-to-user-table";

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

TrainingSessionBelongsToUsers.init(TRAINING_SESSION_BELONGS_TO_USER_TABLE_ATTRIBUTES, {
    tableName: TRAINING_SESSION_BELONGS_TO_USER_TABLE_NAME,
    sequelize: sequelize,
});
