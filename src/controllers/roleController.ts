import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { RoleService } from '../services/roleService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import { GroupService } from '../services/groupService';

import config from '../config/config';
const { errors } = config;
// GET
sw.swagger({
  api: "/role",
  method: "get",
  summary: "Fetch all the roles",
  tags: "ROLE",
  fields: [
  ]
});

// GET BY ID
sw.swagger({
  api: "/role/{id}",
  method: "get",
  summary: "Fetch role by id",
  tags: "ROLE",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
});

//POST
sw.swagger({
  api: "/role",
  method: "post",
  summary: "Create a role",
  tags: "ROLE",
  fields: [
    "name",
    "groupids"
    // { name: "groupids", required: false, in: "formData", type: "object" },
    // { name: "groupids", required: false, in: "formData", type: "object" },
  ]
})

//PUT GROUP
sw.swagger({
  api: "/role/push/{id}",
  method: "put",
  summary: "Push a group into role by id",
  tags: "ROLE",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name",
    "groupids"
  ]
})


//PUT
sw.swagger({
  api: "/role/{id}",
  method: "put",
  summary: "Edit a role by id",
  tags: "ROLE",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name",
    { name: "groupids", required: false, in: "formData", type: "object" },
  ]
})

//DELETE
sw.swagger({
  api: "/role/{id}",
  method: "delete",
  summary: "Delete a role by id",
  tags: "ROLE",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
})

const roleRouter: Router = Router();

roleRouter.route('/')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const roleService = new RoleService();
    // if (Object(req.user).group.length == 0) {
      try {
        const response = await roleService.getAll();
        res.status(HttpStatus.OK).json({
          success: true,
          data: response
        });
      } catch (err) {
        let error: ErrorStructure = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: errors.bad_request
        };
        next(error);
      }
    // } else {
    //   res.status(401).json({
    //     success: false,
    //     data: { "message": "You Are Not Authorized" }
    //   });
    // }
  })
  .post(
    [
      body('name').isLength({ min: 1 }),
      body('groupids').isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);

        if (validationErrors.isEmpty()) {
          const roleService = new RoleService();
          await roleService.createRole(req.body);
          try {
            // req.body.groupids = (typeof (req.body.groupids) == 'string') ? JSON.parse(req.body.groupids) : req.body.groupids;
            // const groupService = new GroupService()
            // if (req.body.groupids && !(await groupService.idCheck(req.body.groupids))) {
            //   const error: ErrorStructure = {
            //     code: HttpStatus.BAD_REQUEST,
            //     errorObj: { message: "Groups doesnot exists" }
            //   };
            //   next(error);
            // }
            const response = await roleService.insert(req.body);
            res.status(HttpStatus.OK).json({
              success: true,
              data: response
            });
          } catch (err) {
            console.log(err);

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
      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }
    });


roleRouter.route('/:id')

  .get(async (req: Request, res: Response, next: NextFunction) => {
    // if (Object(req.user).group.length == 0) {
      console.log("Hello");
      
      const roleService = new RoleService();
      try {
        const role = await roleService.getById(req.params.id);
        console.log("Role------>",role);
        
        // if role not found
        if (!role) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: `Item Not Found`
          });
          return;
        }
        // return found role
        res.status(HttpStatus.OK).json({
          success: true,
          role: role
        });

      } catch (err) {
        console.log("Error----->",err);
        
        const error: ErrorStructure = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: errors.bad_request
        };
        next(error);
      }
    // } else {
    //   res.status(401).json({
    //     success: false,
    //     data: { "message": "You Are Not Authorized" }
    //   });
    // }
  })

  .put(
    [
      body('name').optional().isLength({ min: 1 }),
      // body('groupids').isArray(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const roleService = new RoleService();
          try {
            req.body.groupids = (typeof (req.body.groupids) == 'string') ? JSON.parse(req.body.groupids) : req.body.groupids;
            const groupService = new GroupService()
            if (req.body.groupids && !(await groupService.idCheck(req.body.groupids))) {
              const error: ErrorStructure = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: { message: "Groups doesnot exists" }
              };
              next(error);
            }
            const role = await roleService.getById(req.params.id);

            if (!role) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }

            if (req.body.name) role.name = req.body.name;
            if (req.body.groupids) role.groupids = req.body.groupids;

            // console.log("Req------>",req.body);
            // console.log("Role------>",role);

            const updatedRole = await roleService.update(role);
            res.status(HttpStatus.OK).json({
              success: true,
              user: updatedRole
            });
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
      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }
    })
  .delete(
    [
      body('id').optional().isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const roleService = new RoleService();
          try {
            const role = await roleService.getById(req.params.id);

            if (!role) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }
            // else{
            let recordId: string = req.params.id;
            // }

            const deleteRes = await roleService.remove(recordId);
            res.status(HttpStatus.NO_CONTENT).json({
              success: true,
              deleteRes
            });
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
      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }
    });

roleRouter.route('/push/:id')
  .put(
    [
      body('name').optional().isLength({ min: 1 }),
      body('groupids').isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const roleService = new RoleService();
          try {
            const role = await roleService.getById(req.params.id);

            if (!role) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }

            if (req.body.name) role.name = req.body.name;
            //TODO
            // if (req.body.groupids) {
            //   let groupId: string = req.body.groupids;
            //   role.groupids.push(groupId)

            // }

            // console.log("Req------>",req.body);
            // console.log("Role------>",role);

            const updatedRole = await roleService.update(role);
            res.status(HttpStatus.OK).json({
              success: true,
              user: updatedRole
            });
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

      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }
    })
export default roleRouter;
