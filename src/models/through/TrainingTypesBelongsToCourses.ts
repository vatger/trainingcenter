import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { TrainingType } from "../TrainingType";
import { Course } from "../Course";
import { TrainingLog } from "../TrainingLog";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";

export class TrainingTypesBelongsToCourses extends Model<
    InferAttributes<TrainingTypesBelongsToCourses>,
    InferCreationAttributes<TrainingTypesBelongsToCourses>
> {
    //
    // Attributes
    //
    declare id: number;
    declare training_type_id: ForeignKey<TrainingType["id"]>;
    declare course_id: ForeignKey<Course["id"]>;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
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
