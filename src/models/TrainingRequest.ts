import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Op } from "sequelize";
import { User } from "./User";
import { TrainingType } from "./TrainingType";
import { TrainingSession } from "./TrainingSession";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { TrainingStation } from "./TrainingStation";
import {
    TRAINING_REQUEST_TABLE_ATTRIBUTES,
    TRAINING_REQUEST_TABLE_NAME,
    TRAINING_REQUEST_TABLE_STATUS_TYPES,
} from "../../db/migrations/20221115171256-create-training-request-table";

export class TrainingRequest extends Model<InferAttributes<TrainingRequest>, InferCreationAttributes<TrainingRequest>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare user_id: ForeignKey<User["id"]>;
    declare training_type_id: ForeignKey<TrainingType["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare status: (typeof TRAINING_REQUEST_TABLE_STATUS_TYPES)[number];
    declare expires: Date;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare comment: CreationOptional<string> | null;
    declare training_session_id: CreationOptional<ForeignKey<TrainingSession["id"]>> | null;
    declare training_station_id: CreationOptional<ForeignKey<TrainingStation["id"]>> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>;
    declare training_type?: NonAttribute<TrainingType>;
    declare course?: NonAttribute<Course>;
    declare training_session?: NonAttribute<TrainingSession>;
    declare training_station?: NonAttribute<TrainingStation>;
    declare number_in_queue?: NonAttribute<number>;

    declare static associations: {
        user: Association<TrainingRequest, User>;
        training_type: Association<TrainingRequest, TrainingType>;
        course: Association<TrainingRequest, Course>;
        training_session: Association<TrainingRequest, TrainingSession>;
        training_station: Association<TrainingRequest, TrainingStation>;
    };

    async getTrainingType(): Promise<TrainingType | null> {
        return await TrainingType.findOne({
            where: {
                id: this.training_type_id,
            },
        });
    }

    async getTrainingStation(): Promise<TrainingStation | null> {
        return await TrainingStation.findOne({
            where: {
                id: this.training_station_id ?? -1,
            },
        });
    }

    async appendNumberInQueue(): Promise<void> {
        this.number_in_queue = await TrainingRequest.count({
            where: {
                training_type_id: this.training_type_id,
                status: "requested",
                id: { [Op.lte]: this.id },
            },
        });
    }
}

TrainingRequest.init(TRAINING_REQUEST_TABLE_ATTRIBUTES, {
    tableName: TRAINING_REQUEST_TABLE_NAME,
    sequelize: sequelize,
});
