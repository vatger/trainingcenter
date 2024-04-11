import { Notification } from "../Notification";
import { User } from "../User";
import Logger, { LogLevels } from "../../utility/Logger";

export function registerNotificationAssociations() {
    //
    // Notification -> User
    //
    Notification.belongsTo(User, {
        as: "user",
        foreignKey: "user_id",
        targetKey: "id",
    });

    //
    // User -> Notification
    //
    User.hasMany(Notification, {
        as: "notifications",
        foreignKey: "user_id",
        sourceKey: "id",
    });

    //
    // Notification -> Author
    //
    Notification.belongsTo(User, {
        as: "author",
        foreignKey: "author_id",
        targetKey: "id",
    });

    //
    // Author -> Notification
    //
    User.hasMany(Notification, {
        as: "author",
        foreignKey: "author_id",
        sourceKey: "id",
    });

    Logger.log(LogLevels.LOG_INFO, "[NotificationAssociations]");
}
