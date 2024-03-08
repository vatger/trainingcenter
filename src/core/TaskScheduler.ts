import Logger, { LogLevels } from "../utility/Logger";
import * as CronJob from "node-cron";
import * as CronParser from "cron-parser";
import { SysLog } from "../models/SysLog";
import { Op } from "sequelize";
import dayjs from "dayjs";
import SendEmailTask from "./tasks/SendEmailTask";
import CheckEndorsementTask from "./tasks/CheckEndorsementTask";
import { Config } from "./Config";

export async function initScheduledJobs() {
    Logger.log(LogLevels.LOG_INFO, `Scheduling Tasks (CRON)`);

    CronJob.schedule(Config.CRON_CONFIG.SYSLOG_CLEANUP, async () => {
        const cutoffTime = dayjs().subtract(7, "day");
        Logger.logToFile(
            `[ ${dayjs().format("DD.MM.YYYY HH:mm:ss")} ] Clearing systemlogs older than: ${cutoffTime.format("DD.MM.YYYY HH:mm:ss")}\n`,
            "cron.log"
        );
        Logger.logToFile(`Next execution: ${dayjs(CronParser.parseExpression("30 2 * * 1-6").next().toDate()).format("DD.MM.YYYY HH:mm:ss")}`, "cron.log");

        await SysLog.destroy({
            where: {
                createdAt: {
                    [Op.lt]: cutoffTime,
                },
            },
        });
    }).now();

    CronJob.schedule(Config.CRON_CONFIG.SEND_EMAIL, async () => {
        await SendEmailTask.handle();
    }).start();

    CronJob.schedule(Config.CRON_CONFIG.CHECK_ENDORSEMENT, async () => {
        await CheckEndorsementTask.handle();
    }).start();

    Logger.log(LogLevels.LOG_SUCCESS, "\0 \u2713 All Tasks scheduled.\n");
}
