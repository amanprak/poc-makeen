import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as sw from '../config/swagger.js'


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

export function index(req: Request, res: Response) {
  res.status(HttpStatus.OK).json({
    name: "AMAN PROJECT",
    message: "HELLO",
    version: "VERSION 0"
  });
}
