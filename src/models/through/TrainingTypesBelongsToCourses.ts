import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { TrainingType } from "../TrainingType";
import { Course } from "../Course";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

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

TrainingTypesBelongsToCourses.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "training_types_belongs_to_courses",
        sequelize: sequelize,
    }
);
