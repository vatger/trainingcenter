import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../../core/Sequelize";
import { TrainingStation } from "../TrainingStation";
import { EndorsementGroup } from "../EndorsementGroup";
import {
    ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_ATTRIBUTES,
    ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_NAME,
} from "../../../db/migrations/20221115171266-create-endorsement-group-belongs-to-station-table";

export class EndorsementGroupBelongsToStations extends Model<
    InferAttributes<EndorsementGroupBelongsToStations>,
    InferCreationAttributes<EndorsementGroupBelongsToStations>
> {
    //
    // Attributes
    //
    declare endorsement_group_id: ForeignKey<EndorsementGroup["id"]>;
    declare station_id: ForeignKey<TrainingStation["id"]>;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;
}

EndorsementGroupBelongsToStations.init(ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_ATTRIBUTES, {
    tableName: ENDORSEMENT_GROUP_BELONGS_TO_STATION_TABLE_NAME,
    sequelize: sequelize,
});
