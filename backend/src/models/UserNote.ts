import { Association, CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../core/Sequelize";
import { User } from "./User";
import { Course } from "./Course";
import { USER_NOTES_TABLE_ATTRIBUTES, USER_NOTES_TABLE_NAME } from "../../db/migrations/20221115171259-create-user-notes-table";

export class UserNote extends Model<InferAttributes<UserNote>, InferCreationAttributes<UserNote>> {
    //
    // Attributes
    //
    declare uuid: string;
    declare user_id: number;
    declare author_id: number;
    declare content: string;

    //
    // Optional Attributes
    //
    declare id: CreationOptional<number>;
    declare course_id: CreationOptional<number> | null;
    declare createdAt: CreationOptional<Date> | null;
    declare updatedAt: CreationOptional<Date> | null;

    //
    // Association placeholders
    //
    declare user?: NonAttribute<User>;
    declare author?: NonAttribute<User>;
    declare course?: NonAttribute<Course>;

    declare static associations: {
        user: Association<UserNote, User>;
        author: Association<UserNote, User>;
        course: Association<UserNote, Course>;
    };

    async getAuthor(): Promise<UserNote | null> {
        return await UserNote.findOne({
            where: {
                uuid: this.uuid,
            },
            include: [UserNote.associations.author],
        });
    }
}

UserNote.init(USER_NOTES_TABLE_ATTRIBUTES, {
    tableName: USER_NOTES_TABLE_NAME,
    sequelize: sequelize,
});
