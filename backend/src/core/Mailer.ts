import nodemailer from "nodemailer";
import { MailConfig } from "./Config";

export const SMTPMailer = nodemailer.createTransport({ ...MailConfig, pool: true });
export const SMTPMailerNonPooled = nodemailer.createTransport(MailConfig);

async function verify() {
    return await SMTPMailer.verify();
}

export default {
    verify,
};
