import { Association, CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { User } from "./User";
import { TrainingType } from "./TrainingType";
import { TrainingSession } from "./TrainingSession";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { Course } from "./Course";
import { TrainingStation } from "./TrainingStation";

export class TrainingRequest extends Model<InferAttributes<TrainingRequest>, InferCreationAttributes<TrainingRequest>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare user_id: ForeignKey<User["id"]>;
    declare training_type_id: ForeignKey<TrainingType["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare status: "requested" | "planned" | "cancelled" | "completed";
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
}

TrainingRequest.init(
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
                model: "users",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        training_type_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "training_types",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        course_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "courses",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        training_station_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_stations",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        comment: {
            type: DataType.TEXT,
            allowNull: true,
        },
        status: {
            type: DataType.ENUM("requested", "planned", "cancelled"),
            allowNull: false,
        },
        expires: {
            type: DataType.DATE,
            allowNull: false,
        },
        training_session_id: {
            type: DataType.INTEGER,
            allowNull: true,
            references: {
                model: "training_sessions",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "set null",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_requests",
        sequelize: sequelize,
    }
);
