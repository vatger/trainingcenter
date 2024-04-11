import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { sequelize } from "../core/Sequelize";

import { CPT_SESSION_TABLE_ATTRIBUTES, CPT_SESSION_TABLE_NAME } from "../../db/migrations/20221115171252-create-cpt-session-table";
import { User } from "./User";
import { TrainingSession } from "./TrainingSession";

export class CptSession extends Model<InferAttributes<CptSession>, InferCreationAttributes<CptSession>> {
    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare examiner_id: ForeignKey<User["id"]> | null;
    declare atsim_passed: CreationOptional<boolean> | null;
    declare log_file_name: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    //
    // Association placeholders
    //
    declare training_session?: NonAttribute<TrainingSession>;
    declare examiner?: NonAttribute<User>;

    declare static associations: {
        training_session: Association<CptSession, TrainingSession>;
        examiner: Association<CptSession, User>;
    };
}

CptSession.init(CPT_SESSION_TABLE_ATTRIBUTES, {
    tableName: CPT_SESSION_TABLE_NAME,
    sequelize: sequelize,
});
