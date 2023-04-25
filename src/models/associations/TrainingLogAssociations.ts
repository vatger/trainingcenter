import { TrainingLog } from "../TrainingLog";
import { User } from "../User";
import Logger, { LogLevels } from "../../utility/Logger";

export function registerTrainingLogAssociations() {
    TrainingLog.belongsTo(User, {
        as: "author",
        foreignKey: "author_id",
        targetKey: "id",
    });

    Logger.log(LogLevels.LOG_INFO, "[TrainingLogAssociations]");
}
