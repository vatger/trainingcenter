import { User } from "../User";
import { UserSettings } from "../UserSettings";
import { UserData } from "../UserData";
import Logger, { LogLevels } from "../../utility/Logger";
import { UserSession } from "../UserSession";
import { UserNote } from "../UserNote";
import { Course } from "../Course";
import { Role } from "../Role";
import { RoleHasPermissions } from "../through/RoleHasPermissions";
import { RoleBelongsToUsers } from "../through/RoleBelongsToUsers";
import { TrainingSession } from "../TrainingSession";
import { TrainingLog } from "../TrainingLog";
import { TrainingSessionBelongsToUsers } from "../through/TrainingSessionBelongsToUsers";

export function registerUserAssociations() {
    //
    // User -> UserData
    // 1 : 1
    //
    User.hasOne(UserData, {
        sourceKey: "id",
        foreignKey: "user_id",
        as: "user_data",
    });

    //
    // User <- UserData
    // 1 : 1
    //
    UserData.belongsTo(User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
    });

    //
    // User -> UserSettings
    // 1 : 1
    //
    User.hasOne(UserSettings, {
        sourceKey: "id",
        foreignKey: "user_id",
        as: "user_settings",
    });

    //
    // Session -> User
    // 1 : 1
    //
    UserSession.hasOne(User, {
        as: "user",
        foreignKey: "id",
        sourceKey: "user_id",
    });

    //
    // User -> UserNote
    // 1 : n
    //
    User.hasMany(UserNote, {
        as: "notes",
        foreignKey: "user_id",
        sourceKey: "id",
    });

    //
    // UserNote -> Course
    // 1 : 1
    //
    UserNote.hasOne(Course, {
        as: "course",
        foreignKey: "id",
        sourceKey: "course_id",
    });

    //
    // UserNote -> User
    // 1 : 1
    //
    UserNote.hasOne(User, {
        as: "user",
        foreignKey: "id",
        sourceKey: "user_id",
    });

    //
    // UserNote -> User
    // 1 : 1
    //
    UserNote.hasOne(User, {
        as: "author",
        foreignKey: "id",
        sourceKey: "author_id",
    });

    //
    // User -> Roles
    //
    User.belongsToMany(Role, {
        as: "roles",
        through: RoleBelongsToUsers,
        foreignKey: "user_id",
        otherKey: "role_id",
    });

    //
    // Role -> User
    //
    Role.belongsToMany(User, {
        as: "users",
        through: RoleBelongsToUsers,
        foreignKey: "role_id",
        otherKey: "user_id",
    });

    //
    // User -> Training Logs
    //
    User.belongsToMany(TrainingLog, {
        as: "training_logs",
        through: TrainingSessionBelongsToUsers,
        foreignKey: "user_id",
        otherKey: "log_id",
    });

    Logger.log(LogLevels.LOG_INFO, "[UserAssociations]");
}
