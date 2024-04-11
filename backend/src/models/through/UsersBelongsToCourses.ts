import { Model, InferAttributes, CreationOptional, InferCreationAttributes, ForeignKey, NonAttribute, Association } from "sequelize";
import { User } from "../User";
import { Course } from "../Course";
import { TrainingType } from "../TrainingType";
import { sequelize } from "../../core/Sequelize";
import {
    USER_BELONGS_TO_COURSE_TABLE_ATTRIBUTES,
    USER_BELONGS_TO_COURSE_TABLE_NAME,
} from "../../../db/migrations/20221115171259-create-user-belongs-to-course-table";

export class UsersBelongsToCourses extends Model<InferAttributes<UsersBelongsToCourses>, InferCreationAttributes<UsersBelongsToCourses>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare course_id: ForeignKey<Course["id"]>;
    declare completed: boolean;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number> | null;
    declare next_training_type: CreationOptional<ForeignKey<TrainingType>> | number | null; // Required for type inference - don't know why
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare training_type_next?: NonAttribute<TrainingType>;
    declare course?: NonAttribute<Course>;

    declare static associations: {
        training_type_next: Association<UsersBelongsToCourses, TrainingType>;
        course: Association<UsersBelongsToCourses, Course>;
    };
}

UsersBelongsToCourses.init(USER_BELONGS_TO_COURSE_TABLE_ATTRIBUTES, {
    tableName: USER_BELONGS_TO_COURSE_TABLE_NAME,
    sequelize: sequelize,
});
