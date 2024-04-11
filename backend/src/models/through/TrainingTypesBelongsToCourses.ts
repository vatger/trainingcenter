import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { TrainingType } from "../TrainingType";
import { Course } from "../Course";
import { sequelize } from "../../core/Sequelize";
import {
    TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_ATTRIBUTES,
    TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_NAME,
} from "../../../db/migrations/20221115171259-create-training-type-belongs-to-course-table";

export class TrainingTypesBelongsToCourses extends Model<
    InferAttributes<TrainingTypesBelongsToCourses>,
    InferCreationAttributes<TrainingTypesBelongsToCourses>
> {
    //
    // Attributes
    //
    declare training_type_id: ForeignKey<TrainingType["id"]>;
    declare course_id: ForeignKey<Course["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

TrainingTypesBelongsToCourses.init(TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_ATTRIBUTES, {
    tableName: TRAINING_TYPE_BELONGS_TO_COURSE_TABLE_NAME,
    sequelize: sequelize,
});
