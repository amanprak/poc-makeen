
import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { UserService } from '../services/userService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import { AuthHandler } from '../config/authHandler';

import config from '../config/config';
const { errors } = config;
//POST BY EMAIL
sw.swagger({
    api: "/token",
    method: "post",
    summary: "Get Token By Email",
    tags: "TOKEN",
    fields: [
        "email",
    ]
})

const tokenRouter: Router = Router();


tokenRouter.route('/')
    .post([
        body('email').isEmail(),
    ], async (req: Request, res: Response, next: NextFunction) => {

        const userService = new UserService();
        try {
            const user = await userService.getByEmail(req.body.email);
            console.log("Users----->", user);

            
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: `Users Not Found`
                });
                return;
            }
            const authHandler = new AuthHandler();
            const token = authHandler.generateToken(user);
            res.status(HttpStatus.OK).json({
                success: true,
                token: token
            });
            return;


        } catch (err) { 
            const error: ErrorStructure = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: errors.bad_request
            };
            next(error);
        }

    })


export default tokenRouter;
