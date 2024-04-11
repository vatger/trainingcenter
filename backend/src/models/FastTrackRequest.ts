import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association, ForeignKey } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { FAST_TRACK_REQUEST_TABLE_ATTRIBUTES, FAST_TRACK_REQUEST_TABLE_NAME } from "../../db/migrations/20221115171262-create-fast-track-request-table";

export class FastTrackRequest extends Model<InferAttributes<FastTrackRequest>, InferCreationAttributes<FastTrackRequest>> {
    //
    // Attributes
    //
    declare user_id: ForeignKey<User["id"]>;
    declare requested_by_user_id: ForeignKey<User["id"]>;
    declare status: number;
    declare rating: number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare file_name: CreationOptional<string> | null;
    declare comment: CreationOptional<string> | null;
    declare response: CreationOptional<string> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>; // User
    declare requested_by_user?: NonAttribute<User>; // Requested by

    declare static associations: {
        user: Association<FastTrackRequest, User>;
        requested_by_user: Association<FastTrackRequest, User>;
    };
}

FastTrackRequest.init(FAST_TRACK_REQUEST_TABLE_ATTRIBUTES, {
    tableName: FAST_TRACK_REQUEST_TABLE_NAME,
    sequelize: sequelize,
});
