import { config } from './roleSheet';
import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';

console.log("Data------>", config);

// const collection = (user: Object) => {
//     // if(config.collection[request.])         // check method + api allowed 

//     // check accessibilty global manager : all, manager : $group id , regular : No access
//     //
// }

export async function permissions(req: Request, res: Response, next: NextFunction) {
    // console.log("Request------>",req.headers);
    console.log("req.path------>", req.path);
    console.log("req.originalUrl----->", req.originalUrl);
    console.log("req.method----->", req.method);
    console.log("Params---->", req.params);
    // console.log("req.baseUrl------->", req.url);

    // console.log("req.baseUrl------->", req.baseUrl);
    // var url_parts = url.parse(req.url, true);
    // console.log(url_parts);

    // req.user = {
    //     a: "a"
    // };
    let pathParams: any = req.path.split('/');
    if (pathParams.length > 2) {
        pathParams = ((pathParams[pathParams.length - 1]).split('?'))[0];
        req.body.pathParams = pathParams;
    } else {
        pathParams = ""
    }
    console.log("Path Params----->", pathParams);
    let api = '/' + (req.path.split('/')[1]);
    // console.log(('/'+req.path.split('/')[1]) in config));
    console.log("API-------->", api);

    if (api in config) {
        console.log("Hello", config[api].allowedMethods);

        if (config[api].allowedMethods.includes(req.method)) {

            // console.log("Registered Path", config[api][req.method].roles.globalManager.permissions);
            // config[req.path]['GET'].roles.globalManager.permissions.hello();
            if (config[api][req.method].allowedRoles.includes(req.user['primaryRole'])) {
                console.log("Role Allowed");
                try {
                    const access=await config[api][req.method].roles[req.user['primaryRole']].permissions.access(req.body, req.user);
                    req.user['filter'] = access;
                    next();
                } catch (err) {
                    console.log("Here in error", err);
                    return res.status(HttpStatus.UNAUTHORIZED).json({
                        message: err,
                    });
                }
            } else {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: "You are not authorized",
                });
            }
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: "Method Not Allowed",
            });
        }


    } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
            message: "Unregistered Request",
        });
    }
}