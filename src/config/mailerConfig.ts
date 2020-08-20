import * as nodemailer from 'nodemailer';
import config from './config';

export class mailConfig {
    config = config;
    mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mail.host,
            pass: config.mail.password
        }
    });

}
