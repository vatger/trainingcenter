import { Error } from "sequelize";
import { authenticate } from "./Sequelize";
import Logger, { LogLevels } from "../utility/Logger";
import { Config } from "./Config";
import { registerAssociations } from "../models/associations/_RegisterAssociations";
import { initScheduledJobs } from "./TaskScheduler";
import dayjs from "dayjs";
import Mailer from "./Mailer";

let non_critical_count = 0;

export const initializeApplication = async () => {
    Logger.log(
        LogLevels.LOG_INFO,
        `=================== ${dayjs().format("DD.MM.YYYY HH:mm:ss")} ================== \nApplication starting...\nVersion: ${Config.APP_VERSION}\n`
    );

    await clearLogFiles();

    await checkDatabaseConnection();

    await checkMailConnection();

    await registerModelAssociations();

    await initScheduledJobs();

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
            Logger.logToFile(e.stack, "sequelize.log");
        }
        throw e;
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Database Connection established.\n");
}

async function checkMailConnection() {
    Logger.log(LogLevels.LOG_INFO, `Checking Database Connection [${Config.EMAIL_CONFIG.SMTP_HOST}:${Config.EMAIL_CONFIG.SMTP_PORT}]`);
    try {
        await Mailer.verify();
    } catch (e: any) {
        Logger.log(
            LogLevels.LOG_ERROR,
            `\0 \u2A2F Failed to connect to Mailserver. Error: ${e.name} \n\t To check the stack-trace, navigate to log/sequelize.log`
        );
        Logger.logToFile(e.message, "sequelize.log");
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Mailserver Connection established.\n");
}

async function registerModelAssociations() {
    Logger.log(LogLevels.LOG_INFO, `Registering Associations`);
    try {
        registerAssociations();
    } catch (e: any) {
        Logger.log(LogLevels.LOG_ERROR, `\0 \u2A2F Failed to register some (or all) associations. Check log/sequelize.log for more information`);
        Logger.logToFile(e.stack, "sequelize.log");

        throw e;
    }
    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 Associations registered successfully.");
}
