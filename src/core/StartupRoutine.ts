import { Error } from "sequelize";
import { authenticate } from "./Sequelize";
import Logger, { LogLevels } from "../utility/Logger";
import { Config } from "./Config";
import moment from "moment";
import { registerAssociations } from "../models/associations/_RegisterAssociations";
import { initScheduledJobs } from "./TaskScheduler";

let non_critical_count = 0;

export const initializeApplication = async () => {
    Logger.log(
        LogLevels.LOG_INFO,
        `=================== ${moment().format("DD.MM.YYYY HH:mm:ss")} ================== \nApplication starting...\nVersion: ${Config.APP_VERSION}\n`
    );

    await clearLogFiles();

    await initScheduledJobs();

    await checkDatabaseConnection();

    await registerModelAssociations();

    Logger.log(
        LogLevels.LOG_INFO,
        `\nStartup complete - ${non_critical_count} non-critical check(s) failed. \n==========================================================\n`
    );
};

async function clearLogFiles() {
    Logger.log(LogLevels.LOG_INFO, "Clearing previous log files from log/*");
    try {
        await Logger.clearLogEntries();
    } catch (e) {
        Logger.log(LogLevels.LOG_WARN, `\0 \u2A2F Failed to clear log files. Not critical -> continuing\n`);
        non_critical_count++;
        return;
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Log files cleared.\n");
}

async function checkDatabaseConnection() {
    Logger.log(LogLevels.LOG_INFO, `Checking Database Connection [${Config.DATABASE_CONFIG.HOST}:${Config.DATABASE_CONFIG.PORT}]`);
    try {
        await authenticate();
    } catch (e: any) {
        if (e instanceof Error) {
            Logger.log(
                LogLevels.LOG_ERROR,
                `\0 \u2A2F Failed to connect to Database. Error: ${e.name} \n\t To check the stack-trace, navigate to log/sequelize.log`
            );
            await Logger.logToFile(e.stack, "sequelize.log");
        }
        throw e;
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Database Connection established.\n");
}

async function registerModelAssociations() {
    Logger.log(LogLevels.LOG_INFO, `Registering Associations`);
    try {
        await registerAssociations();
    } catch (e: any) {
        Logger.log(LogLevels.LOG_ERROR, `\0 \u2A2F Failed to register some (or all) associations. Check log/sequelize.log for more information`);
        await Logger.logToFile(e.stack, "sequelize.log");

        throw e;
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Associations registered successfully.");
}
