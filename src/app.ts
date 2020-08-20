import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { createConnection } from 'typeorm';
import config from './config/config';
import routes from './routes';
import { serve, setup } from 'swagger-ui-express'
import * as swaggerDocument from '../src/config/swagger.js'
import genericErrorHandler from './utilites/genericErrorHandler';
import notFoundHandler from './utilites/notFoundHandler';
import { AuthHandler } from './config/authHandler';

var options = {
    explorer: false,
    swaggerOptions: {
        authAction: { Bearer: { name: "Bearer", schema: { type: "apiKey", in: "header", name: "Authorization" }, value: "Bearer <JWT>" } }
    },
    customCss: '.swagger-ui .topbar { display: none }',
    // customCssUrl: '/custom.css'
};


export class Application {
    app: express.Application;
    config = config;

    constructor() {
        this.app = express();
        this.app.locals.name = this.config.name;
        this.app.locals.version = this.config.version;

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(new AuthHandler().initialize());
        this.app.use('/api-docs', serve, setup(swaggerDocument.sw, options));
        this.app.use('', routes);
        this.app.use(genericErrorHandler);
        this.app.use(notFoundHandler);

    }
    connectDB = async () => {
        const conn = await createConnection();
        // await conn.synchronize();
        console.log(`Connected to database. Connection: ${conn.name} / ${conn.options.database}`);

        await this.startServer();
    }

    startServer(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.app.listen(+this.config.port, this.config.host, () => {
                console.log(`Server started at http://${this.config.host}:${this.config.port}`);
                console.log(`Access API via http://${this.config.host}:${this.config.port}/api-docs`);
                
                resolve(true);
            }).on('error', (err) => {
                console.error("Error in starting server----->", err);
            });
        });
    }
}    