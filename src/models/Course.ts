import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingType } from "./TrainingType";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { MentorGroup } from "./MentorGroup";
import { User } from "./User";
import { CourseInformation } from "./CourseInformation";

export class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare name: string;
    declare name_en: string;
    declare description: string;
    declare description_en: string;
    declare is_active: boolean;
    declare self_enrollment_enabled: boolean;
    declare initial_training_type: ForeignKey<TrainingType["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
    declare deletedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_type?: NonAttribute<TrainingType>; // Initial training type
    declare training_types?: NonAttribute<TrainingType[]>; // List of all training types assigned to this course
    declare action_requirements?: NonAttribute<ActionRequirement[]>;
    declare mentor_groups?: NonAttribute<MentorGroup[]>;
    declare users?: NonAttribute<User[]>;
    declare information?: NonAttribute<CourseInformation>;

    declare static associations: {
        training_type: Association<Course, TrainingType>;
        training_types: Association<Course, TrainingType>;
        action_requirements: Association<Course, ActionRequirement>;
        mentor_groups: Association<Course, MentorGroup>;
        users: Association<Course, User>;
        information: Association<Course, CourseInformation>;
    };

    static async getIDFromUUID(uuid?: string): Promise<number> {
        if (uuid == null) return -1;

        const course = await Course.findOne({
            where: {
                uuid: uuid,
            },
        });

        return course?.id ?? -1;
    }

    static async getUUIDFromID(id: string | number): Promise<string | undefined> {
        const course = await Course.findOne({
            where: {
                id: id,
            },
        });

        return course?.uuid;
    }
}

Course.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataType.UUID,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataType.STRING(70),
            comment: "Course Name. Max length 70 chars",
            allowNull: false,
        },
        name_en: {
            type: DataType.STRING(70),
            comment: "Course Name. Max Length 70 chars. English text",
            allowNull: false,
        },
        description: {
            type: DataType.TEXT,
            allowNull: false,
        },
        description_en: {
            type: DataType.TEXT,
            allowNull: false,
        },
        is_active: {
            type: DataType.BOOLEAN,
            comment: "If true then course is visible",
            allowNull: false,
        },
        self_enrollment_enabled: {
            type: DataType.BOOLEAN,
            comment: "If true a user can self-enrol in this course",
            allowNull: false,
        },
        initial_training_type: {
            type: DataType.INTEGER,
            comment: "Training Type ID",
            allowNull: false,
            references: {
                model: "training_types",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
        deletedAt: {
            type: DataType.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "courses",
        sequelize: sequelize,
    }
);
