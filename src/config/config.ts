import * as dotenv from 'dotenv';


import errors from '../assets/errors';
import messages from '../assets/messages';

dotenv.config();

export default {
    errors,
    messages, 
    name:"POC Makeen",
    version:"v1",
    host: process.env.APP_HOST || '127.0.0.1',
    environment: process.env.APP_ENV || 'development',
    port: (process.env.APP_PORT) || '3000',
    auth: {
        secretKey: process.env.SECRET_KEY || 'AMANSECRET'
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    mail:{
        host: process.env.MAILER_HOST,
        password: process.env.MAILER_PASSWORD
    }
}