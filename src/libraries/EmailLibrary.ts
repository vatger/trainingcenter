import fs from "fs";
import path from "path";
import * as handlebars from "handlebars";
import Logger, { LogLevels } from "../utility/Logger";
import { Config } from "../core/Config";
import { SMTPMailer, SMTPMailerNonPooled } from "../core/Mailer";
import { Transporter } from "nodemailer";
import dayjs from "dayjs";

type SendMailOptions = {
    recipient: string;
    subject: string;
    fileName: string;
    replacements: object;
};

export type EMailTypes = "message" | "reminder";
export type EMailPayload = {
    type: EMailTypes; // Corresponds to records defining replacements for each type of mail
    recipient: string;
    subject: string;
    replacements:
        | Record<"message", { message_de: string; message_en: string; name: string }>
        | Record<"reminder", { name: string; expiry_date: string; link: string }>;
};

async function sendMail(options: SendMailOptions, nonPooled = true) {
    try {
        const file = fs.readFileSync(path.join(process.cwd(), `/misc/mail-templates/${options.fileName}`), { encoding: "utf-8" });
        const template = handlebars.compile(file);

        let message = {
            to: Config.APP_DEBUG ? Config.EMAIL_CONFIG.DEBUG_EMAIL : options.recipient,
            from: Config.EMAIL_CONFIG.SMTP_USERNAME,
            subject: options.subject,
            html: template({ ...options.replacements, date_now: dayjs.utc().format(Config.DATETIME_FORMAT) }),
        };

        let mailer: Transporter = SMTPMailer;
        if (nonPooled) {
            mailer = SMTPMailerNonPooled;
        }

        mailer.sendMail(message, e => {
            if (e == null) {
                Logger.log(LogLevels.LOG_SUCCESS, `[MAIL] Successfully sent mail to: ${message.to}`);
            } else {
                Logger.log(LogLevels.LOG_ERROR, `Failed to send E-Mail! Error: ${e.message}`);
            }
        });
        return true;
    } catch (e: any) {
        Logger.log(LogLevels.LOG_ERROR, `Failed to send E-Mail! Error: ${e}`);
        return false;
    }
}

export default {
    sendMail,
};
