import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { JOBS_TABLE_ATTRIBUTES, JOBS_TABLE_NAME, JOBS_TABLE_STATUS_TYPES } from "../../db/migrations/20221115171262-create-jobs-table";

export class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare attempts: number;
    declare status: (typeof JOBS_TABLE_STATUS_TYPES)[number];

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare payload: CreationOptional<string> | null;
    declare job_type: CreationOptional<string> | null;
    declare last_executed: CreationOptional<Date> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

Job.init(JOBS_TABLE_ATTRIBUTES, {
    tableName: JOBS_TABLE_NAME,
    sequelize: sequelize,
});
