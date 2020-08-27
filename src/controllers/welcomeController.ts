import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as sw from '../config/swagger.js'
import { UserService } from '../services/userService';

/**
 * Controller to handle / GET request, show API information
 *
 *
 * @param {Request} req
 * @param {Response} res
 */


// GET
sw.swagger({
  api: "/",
  method: "get",
  summary: "WELCOME API",
  tags: "WELCOME",
  fields: [
  ]
});

export async function index(req: Request, res: Response) {
  const userService = new UserService();
  // const result= await userService.query("users", "1=1", {});
  // const result= await userService.query("users", ":id = ANY(users.roleids)", {id:'fb5b9da6-1aff-4852-af40-1c35ce1b0a71'});

  // console.log("Result----->",result);
  
  res.status(HttpStatus.OK).json({
    name: "AMAN PROJECT",
    message: "HELLO",
    version: "VERSION 0"
  });
}
