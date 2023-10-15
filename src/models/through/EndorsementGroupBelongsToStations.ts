import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DataType } from "sequelize-typescript";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../TrainingStation";
import { EndorsementGroup } from "../EndorsementGroup";

export class EndorsementGroupBelongsToStations extends Model<
    InferAttributes<EndorsementGroupBelongsToStations>,
    InferCreationAttributes<EndorsementGroupBelongsToStations>
> {
    //
    // Attributes
    //
    declare id: number;
    declare endorsement_group_id: ForeignKey<EndorsementGroup["id"]>;
    declare station_id: ForeignKey<TrainingStation["id"]>;

    //
    // Optional Attributes
    //
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

EndorsementGroupBelongsToStations.init(
    {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        endorsement_group_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "endorsement_groups",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        station_id: {
            type: DataType.INTEGER,
            allowNull: false,
            references: {
                model: "training_stations",
                key: "id",
            },
            onUpdate: "cascade",
            onDelete: "cascade",
        },
        createdAt: DataType.DATE,
        updatedAt: DataType.DATE,
    },
    {
        tableName: "endorsement_group_belongs_to_stations",
        sequelize: sequelize,
    }
);
