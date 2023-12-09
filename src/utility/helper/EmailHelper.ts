import fs from "fs";
import path from "path";
import * as handlebars from "handlebars";
import Logger, { LogLevels } from "../Logger";
import { Config } from "../../core/Config";
import { SMTPMailer, SMTPMailerNonPooled } from "../../core/Mailer";

async function sendMail(to: string, subject: string, templateName: string, replacements: object, nonPooled: boolean = false) {
    try {
        console.log(process.cwd());

        const file = fs.readFileSync(path.join(process.cwd(), `/misc/mail-templates/${templateName}`), { encoding: "utf-8" });
        const template = handlebars.compile(file);

        let message = {
            to: Config.APP_DEBUG ? Config.EMAIL_CONFIG.DEBUG_EMAIL : to,
            from: Config.EMAIL_CONFIG.SMTP_USERNAME,
            subject: subject,
            html: template(replacements),
        };

        let mailer;
        if (nonPooled) {
            mailer = SMTPMailerNonPooled;
        } else {
            mailer = SMTPMailer;
        }

        mailer.sendMail(message, e => {
            if (e == null) {
                console.log(`Sent mail to: ${message.to}.`);
            } else {
                Logger.log(LogLevels.LOG_ERROR, `Failed to send E-Mail! Error: ${e.message}`);
            }
        });
    } catch (e: any) {
        Logger.log(LogLevels.LOG_ERROR, `Failed to send E-Mail! Error: ${e}`);
    }
}

export default {
    sendMail,
};
