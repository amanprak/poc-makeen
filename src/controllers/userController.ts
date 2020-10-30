import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { UserService } from '../services/userService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import { RoleService } from '../services/roleService';
import { mailer } from '../utilites/mailerService';
// import e = require('express');
import { GroupService } from '../services/groupService';
import config from '../config/config';
const { errors } = config;
// GET
sw.swagger({
    api: "/user",
    method: "get",
    summary: "Fetch all the users",
    tags: "USER",
    fields: [
    ]
});

// GET BY ID
sw.swagger({
    api: "/user/{id}",
    method: "get",
    summary: "Fetch user by id",
    tags: "USER",
    fields: [
        { name: "id", required: false, in: "path", type: "string" },
    ]
});

//POST
sw.swagger({
    api: "/user",
    method: "post",
    summary: "Create a user",
    tags: "USER",
    fields: [
        "email",
        { name: "roleids", required: false, in: "formData", type: "object" },
    ]
})



//PUT
sw.swagger({
    api: "/user/{id}",
    method: "put",
    summary: "Edit a user by id",
    tags: "USER",
    fields: [
        { name: "id", required: false, in: "path", type: "string" },
        "email",
        { name: "roleids", required: false, in: "formData", type: "object" }
    ]
})

//DELETE
sw.swagger({
    api: "/user/{id}",
    method: "delete",
    summary: "Delete a user by id",
    tags: "USER",
    fields: [
        { name: "id", required: false, in: "path", type: "string" },
    ]
})




const userRouter: Router = Router();

userRouter.route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        const userService = new UserService();

        try {
            console.log("Request", Object(req.user));
            // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
            //     let response = [];
            //     // console.log("Id------>",req.body.user.group[0].id);
            //     for (const i of Object(req.user).group) {
            //         // console.log("Group Id-------->",i.id);
            //         let temp = (await userService.getUserByGroup(i.id));
            //         // console.log("Temp------>",users.indexOf(temp));
            //         // console.log("Temp11------>",temp);
            //         if (response.indexOf(temp) == -1) response.push(temp)
            //         console.log("User---->", response);

            //     }
            //     // const response = await userService.getAll();
            //     res.status(HttpStatus.OK).json({
            //         success: true,
            //         data: response
            //     });
            // } else if (Object(req.user).group.length == 0) {
            // const response = await userService.getAll();
            console.log("Req User-------->",req.user);
            // const response = await userService.getUserByGroup(req.user['filter']);
            const response = await userService.getAll();

            console.log("Response--->",response);
            
            res.status(HttpStatus.OK).json({
                success: true,
                data: response
            });
            // const response = await userService.getAll();
            // res.status(HttpStatus.OK).json({
            //     success: true,
            //     data: response
            // });
            // } else {
            //     res.status(401).json({
            //         success: false,
            //         data: { "message": "You Are Not Authorized" }
            //     });
            // }
        } catch (err) {
            console.log("Error----->", err);

            let error: ErrorStructure = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: errors.bad_request
            };
            next(error);
        }
    })
    .post(
        [
            body('email').isEmail(),
        ],
        async (req: Request, res: Response, next: NextFunction) => {

            const validationErrors = validationResult(req);

            if (validationErrors.isEmpty()) {
                const userService = new UserService();
                try {
                    req.body.roleids = (typeof (req.body.roleids) == 'string') ? JSON.parse(req.body.roleids) : req.body.roleids;
                    const roleService = new RoleService()
                    if (!(await roleService.idCheck(req.body.roleids))) {
                        const error: ErrorStructure = {
                            code: HttpStatus.BAD_REQUEST,
                            errorObj: { message: "Role doesnot exists" }
                        };
                        next(error);
                    } else {
                        let validRole = 0;
                        // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
                        //     for (const i of Object(req.user).group) {
                        //         let temp = (await roleService.hasGroup(i.id));
                        //         console.log("Temp------>", req.body.roleids);

                        //         if (temp.some(item => (req.body.roleids.includes(item)))) {
                        //             console.log("Valid Case");

                        //             validRole = 1;
                        //             break;
                        //         }
                        //     }
                        //     if (validRole == 0) {
                        //         const error: ErrorStructure = {
                        //             code: 401,
                        //             errorObj: { "message": "You are not authorized" }
                        //         };
                        //         next(error);
                        //     } else {
                        //         await userService.createUser(req.body);
                        //         const response = await userService.insert(req.body);
                        //         res.status(HttpStatus.OK).json({
                        //             success: true,
                        //             data: response
                        //         });
                        //     }
                        // } else if (Object(req.user).group.length == 0) {
                        await userService.createUser(req.body);
                        const response = await userService.insert(req.body);
                        res.status(HttpStatus.OK).json({
                            success: true,
                            data: response
                        });
                        // } else {
                        //     const error: ErrorStructure = {
                        //         code: 401,
                        //         errorObj: { "message": "You are not authorized" }
                        //     };
                        //     next(error);
                        // }

                    }
                } catch (err) {
                    console.log("Error------>", err);

                    const error: ErrorStructure = {
                        code: HttpStatus.BAD_REQUEST,
                        errorObj: errors.bad_request
                    };
                    next(error);
                }
            } else {
                const error: ErrorStructure = {
                    code: HttpStatus.BAD_REQUEST,
                    errorsArray: validationErrors.array()
                };
                next(error);
            }

        });


userRouter.route('/:id')

    .get(async (req: Request, res: Response, next: NextFunction) => {

        const userService = new UserService();
        try {
            const user = await userService.getById(req.params.id);
            console.log("Users----->", user);
            let role = [];
            let group = [];
            const roleService = new RoleService();
            // const groupService = new GroupService();
            //TODO
            // for (const i of user.roleids) {
            //     console.log("Role---->", i);
            //     // console.log(await roleService.getById(i));
            //     let currRole = await roleService.getById(i);
            //     role.push(Object(currRole).id);
            //     if (currRole.groupids && currRole.groupids != null) {
            //         for (const j of groupids) {
            //             group.push(Object(await groupService.getById(j)).id)
            //         }
            //     }
            // }

            let validRole = 0;
            // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
            //     for (const i of Object(req.user).group) {
            //         let temp = (await roleService.hasGroup(i.id));
            //         // console.log("Temp------>", req.body.roleids);

            //         if (temp.some(item => (user.roleids.includes(item)))) {
            //             console.log("Valid Case");

            //             validRole = 1;
            //             break;
            //         }
            //     }
            //     if (validRole == 0) {
            //         const error: ErrorStructure = {
            //             code: 401,
            //             errorObj: { "message": "You are not authorized" }
            //         };
            //         next(error);
            //     } else {
            //         if (!user) {
            //             res.status(HttpStatus.NOT_FOUND).json({
            //                 success: false,
            //                 message: `Item Not Found`
            //             });
            //             return;
            //         }
            //         res.status(HttpStatus.OK).json({
            //             success: true,
            //             user: user
            //         });
            //     }
            // } else if (Object(req.user).group.length == 0) {
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: `Item Not Found`
                });
                return;
            }
            res.status(HttpStatus.OK).json({
                success: true,
                user: user
            });
            // } else {
            //     const error: ErrorStructure = {
            //         code: 401,
            //         errorObj: { "message": "You are not authorized" }
            //     };
            //     next(error);
            // }



        } catch (err) {
            const error: ErrorStructure = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: errors.bad_request
            };
            next(error);
        }

    })

    .put(
        [
            body('email').optional().isLength({ min: 1 }),
        ],
        async (req: Request, res: Response, next: NextFunction) => {
            const validationErrors = validationResult(req);
            if (validationErrors.isEmpty()) {
                const userService = new UserService();
                try {
                    req.body.roleids = (typeof (req.body.roleids) == 'string') ? JSON.parse(req.body.roleids) : req.body.roleids;
                    const roleService = new RoleService()
                    if (req.body.roleids && !(await roleService.idCheck(req.body.roleids))) {
                        const error: ErrorStructure = {
                            code: HttpStatus.BAD_REQUEST,
                            errorObj: { message: "Groups doesnot exists" }
                        };
                        next(error);
                    }
                    const user = await userService.getById(req.params.id);

                    let validRole = 0;
                    // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
                    //     for (const i of Object(req.user).group) {
                    //         let temp = (await roleService.hasGroup(i.id));
                    //         // console.log("Temp------>", req.body.roleids);

                    //         if (temp.some(item => (user.roleids.includes(item)))) {
                    //             console.log("Valid Case");

                    //             validRole = 1;
                    //             break;
                    //         }
                    //     }
                    //     if (validRole == 0) {
                    //         const error: ErrorStructure = {
                    //             code: 401,
                    //             errorObj: { "message": "You are not authorized" }
                    //         };
                    //         next(error);
                    //     } else {
                    //         if (!user) {
                    //             return res.status(HttpStatus.NOT_FOUND).json({
                    //                 success: false,
                    //                 message: `No Id Found`
                    //             });
                    //         }
                    //         let mailOption = {
                    //             to: user.email,
                    //             subject: "Changes in your account",
                    //             html: "<h4>There has been some changes in your account</h4>"
                    //         };
                    //         console.log("Mailing Options------>", mailOption);

                    //         mailer(mailOption);

                    //         if (req.body.email) user.email = req.body.email;
                    //         if (req.body.roleids) user.roleids = req.body.roleids;

                    //         const updatedUser = await userService.update(user);

                    //         res.status(HttpStatus.OK).json({
                    //             success: true,
                    //             user: updatedUser
                    //         });
                    //     }
                    // } else if (Object(req.user).group.length == 0) {
                        if (!user) {
                            return res.status(HttpStatus.NOT_FOUND).json({
                                success: false,
                                message: `No Id Found`
                            });
                        }
                        let mailOption = {
                            to: user.email,
                            subject: "Changes in your account",
                            html: "<h4>There has been some changes in your account</h4>"
                        };
                        console.log("Mailing Options------>", mailOption);

                        mailer(mailOption);

                        if (req.body.email) user.email = req.body.email;
                        if (req.body.roleids) user.roleids = req.body.roleids;

                        const updatedUser = await userService.update(user);

                        res.status(HttpStatus.OK).json({
                            success: true,
                            user: updatedUser
                        });
                    // } else {
                    //     const error: ErrorStructure = {
                    //         code: 401,
                    //         errorObj: { "message": "You are not authorized" }
                    //     };
                    //     next(error);
                    // }


                } catch (err) {
                    const error: ErrorStructure = {
                        code: HttpStatus.BAD_REQUEST,
                        errorObj: errors.bad_request
                    };
                    next(error);
                }
            } else {
                const error: ErrorStructure = {
                    code: HttpStatus.BAD_REQUEST,
                    errorsArray: validationErrors.array()
                };
                next(error);
            }
        })
    .delete(
        [
            body('id').optional().isUUID(),
        ],
        async (req: Request, res: Response, next: NextFunction) => {
            const validationErrors = validationResult(req);
            if (validationErrors.isEmpty()) {
                const userService = new UserService();
                try {
                    const user = await userService.getById(req.params.id);

                    const roleService = new RoleService();
                    const groupService = new GroupService();
                    let validRole = 0;
                    // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
                    //     for (const i of Object(req.user).group) {
                    //         let temp = (await roleService.hasGroup(i.id));
                    //         // console.log("Temp------>", req.body.roleids);

                    //         if (temp.some(item => (user.roleids.includes(item)))) {
                    //             console.log("Valid Case");

                    //             validRole = 1;
                    //             break;
                    //         }
                    //     }
                    //     if (validRole == 0) {
                    //         const error: ErrorStructure = {
                    //             code: 401,
                    //             errorObj: { "message": "You are not authorized" }
                    //         };
                    //         next(error);
                    //     } else {
                    //         if (!user) {
                    //             return res.status(HttpStatus.NOT_FOUND).json({
                    //                 success: false,
                    //                 message: `No Id Found`
                    //             });
                    //         }
                    //         // else{
                    //         let recordId: string = req.params.id;
                    //         // }

                    //         const deleteRes = await userService.remove(recordId);
                    //         res.status(HttpStatus.NO_CONTENT).json({
                    //             success: true,
                    //             deleteRes
                    //         });
                    //     }
                    // } else if (Object(req.user).group.length == 0) {
                        if (!user) {
                            return res.status(HttpStatus.NOT_FOUND).json({
                                success: false,
                                message: `No Id Found`
                            });
                        }
                        // else{
                        let recordId: string = req.params.id;
                        // }

                        const deleteRes = await userService.remove(recordId);
                        res.status(HttpStatus.NO_CONTENT).json({
                            success: true,
                            deleteRes
                        });
                    // } else {
                    //     const error: ErrorStructure = {
                    //         code: 401,
                    //         errorObj: { "message": "You are not authorized" }
                    //     };
                    //     next(error);
                    // }

                } catch (err) {
                    const error: ErrorStructure = {
                        code: HttpStatus.BAD_REQUEST,
                        errorObj: errors.bad_request
                    };
                    next(error);
                }
            } else {
                const error: ErrorStructure = {
                    code: HttpStatus.BAD_REQUEST,
                    errorsArray: validationErrors.array()
                };
                next(error);
            }
        });


export default userRouter;
