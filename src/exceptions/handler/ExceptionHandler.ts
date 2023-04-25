import { BaseError } from "sequelize";
import Logger, { LogLevels } from "../../utility/Logger";

export function handleUncaughtException(err: Error, origin: any) {
    if (err instanceof BaseError) {
        Logger.log(LogLevels.LOG_ERROR, `[ ${err.name} ] ${err.message}`);
        Logger.logToFile(`${err.name}: ${err.message} \n${err.stack}`);
        return;
    }

    console.log(err);
}
