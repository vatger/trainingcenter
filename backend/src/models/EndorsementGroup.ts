import { Model, InferAttributes, CreationOptional, InferCreationAttributes, NonAttribute, Association } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { TrainingStation } from "./TrainingStation";
import { ENDORSEMENT_GROUPS_TABLE_ATTRIBUTES, ENDORSEMENT_GROUPS_TABLE_NAME } from "../../db/migrations/20221115171254-create-endorsement-groups-table";

export class EndorsementGroup extends Model<InferAttributes<EndorsementGroup>, InferCreationAttributes<EndorsementGroup>> {
    //
    // Attributes
    //
    declare name: string;
    declare tier: Number;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare users?: NonAttribute<User[]>;
    declare stations?: NonAttribute<TrainingStation[]>;

    declare static associations: {
        users: Association<EndorsementGroup, User>;
        stations: Association<EndorsementGroup, TrainingStation>;
    };
}

EndorsementGroup.init(ENDORSEMENT_GROUPS_TABLE_ATTRIBUTES, {
    tableName: ENDORSEMENT_GROUPS_TABLE_NAME,
    sequelize: sequelize,
});
