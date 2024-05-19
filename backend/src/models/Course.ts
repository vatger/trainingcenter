import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingType } from "./TrainingType";
import { sequelize } from "../core/Sequelize";
import { ActionRequirement } from "./ActionRequirement";
import { MentorGroup } from "./MentorGroup";
import { User } from "./User";
import { CourseInformation } from "./CourseInformation";
import { COURSE_TABLE_ATTRIBUTES, COURSE_TABLE_NAME } from "../../db/migrations/20221115171247-create-courses-table";
import { EndorsementGroup } from "./EndorsementGroup";

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

Course.init(COURSE_TABLE_ATTRIBUTES, {
    tableName: COURSE_TABLE_NAME,
    sequelize: sequelize,
});
