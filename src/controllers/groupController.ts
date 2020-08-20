import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { GroupService } from '../services/groupService';
// import {CollectionService} from '../services/collectionService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import { CollectionService } from '../services/collectionService';

// GET
sw.swagger({
  api: "/group",
  method: "get",
  summary: "Fetch all the groups",
  tags: "GROUP",
  fields: [
  ]
});

// GET BY ID
sw.swagger({
  api: "/group/{id}",
  method: "get",
  summary: "Fetch group by id",
  tags: "GROUP",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
});

//POST
sw.swagger({
  api: "/group",
  method: "post",
  summary: "Create a group",
  tags: "GROUP",
  fields: [
    "name",
    { name: "collectionids", required: false, in: "formData", type: "object" },
  ]
})

//PUT GROUP
sw.swagger({
  api: "/group/push/{id}",
  method: "put",
  summary: "Push a group into group by id",
  tags: "GROUP",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name",
    "collectionids"
  ]
})


//PUT
sw.swagger({
  api: "/group/{id}",
  method: "put",
  summary: "Edit a group by id",
  tags: "GROUP",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name",
    { name: "collectionids", required: false, in: "formData", type: "object" },
  ]
})

//DELETE
sw.swagger({
  api: "/group/{id}",
  method: "delete",
  summary: "Delete a group by id",
  tags: "GROUP",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
})

const groupRouter: Router = Router();

groupRouter.route('/')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const groupService = new GroupService();
    if (Object(req.user).group.length == 0) {
      try {
        const response = await groupService.getAll();
        res.status(HttpStatus.OK).json({
          success: true,
          data: response
        });
      } catch (err) {
        let error: ErrorStructure = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }
    } else {
      res.status(401).json({
        success: false,
        data: { "message": "You Are Not Authorized" }
      });
    }
  })
  .post(
    [
      body('name').isLength({ min: 1 }),
      // body('collectionids').isArray(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);

        if (validationErrors.isEmpty()) {
          const groupService = new GroupService();
          const collectionService = new CollectionService()
          req.body.collectionids = (typeof (req.body.collectionids) == 'string') ? JSON.parse(req.body.collectionids) : req.body.collectionids;
          console.log("Id Checker---->", (await collectionService.idCheck(req.body.collectionids)));

          if (req.body.collectionids && !(await collectionService.idCheck(req.body.collectionids))) {
            const error: ErrorStructure = {
              code: HttpStatus.BAD_REQUEST,
              errorObj: { message: "Collection doesnot exists" }
            };
            next(error);
          }
          await groupService.createGroup(req.body);
          try {

            const response = await groupService.insert(req.body);
            res.status(HttpStatus.OK).json({
              success: true,
              data: response
            });
          } catch (err) {
            const error: ErrorStructure = {
              code: HttpStatus.BAD_REQUEST,
              errorObj: err
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
      } else {
        res.status(401).json({
          success: false,
          data: { "message": "You Are Not Authorized" }
        });
      }
    });


groupRouter.route('/:id')

  .get(async (req: Request, res: Response, next: NextFunction) => {
    if (Object(req.user).group.length == 0) {
      const groupService = new GroupService();
      try {
        const group = await groupService.getById(req.params.id);

        // if group not found
        if (!group) {
          res.status(HttpStatus.NOT_FOUND).json({
            success: false,
            message: `Item Not Found`
          });
          return;
        }
        // return found group
        res.status(HttpStatus.OK).json({
          success: true,
          group: group
        });

      } catch (err) {
        const error: ErrorStructure = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }

    } else {
      res.status(401).json({
        success: false,
        data: { "message": "You Are Not Authorized" }
      });
    }
  })

  .put(
    [
      body('name').optional().isLength({ min: 1 }),
      // body('collectionids').isArray(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const groupService = new GroupService();
          try {
            const collectionService = new CollectionService()
            req.body.collectionids = (typeof (req.body.collectionids) == 'string') ? JSON.parse(req.body.collectionids) : req.body.collectionids;
            if (req.body.collectionids && !(await collectionService.idCheck(req.body.collectionids))) {
              const error: ErrorStructure = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: { message: "Collection doesnot exists" }
              };
              next(error);
            }
            const group = await groupService.getById(req.params.id);
            req.body.collectionids = (typeof (req.body.collectionids) == 'string') ? JSON.parse(req.body.collectionids) : req.body.collectionids;

            if (!group) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }

            if (req.body.name) group.name = req.body.name;
            if (req.body.collectionids) group.collectionids = req.body.collectionids;

            // console.log("Req------>",req.body);
            // console.log("Groups------>",group);

            const updatedGroup = await groupService.update(group);
            res.status(HttpStatus.OK).json({
              success: true,
              user: updatedGroup
            });
          } catch (err) {
            const error: ErrorStructure = {
              code: HttpStatus.BAD_REQUEST,
              errorObj: err
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
      } else {
        res.status(401).json({
          success: false,
          data: { "message": "You Are Not Authorized" }
        });
      }
    })
  .delete(
    [
      body('id').optional().isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const groupService = new GroupService();
          try {
            const group = await groupService.getById(req.params.id);

            if (!group) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }
            // else{
            let recordId: string = req.params.id;
            // }

            const deleteRes = await groupService.remove(recordId);
            res.status(HttpStatus.NO_CONTENT).json({
              success: true,
              deleteRes
            });
          } catch (err) {
            const error: ErrorStructure = {
              code: HttpStatus.BAD_REQUEST,
              errorObj: err
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
      } else {
        res.status(401).json({
          success: false,
          data: { "message": "You Are Not Authorized" }
        });
      }
    });

groupRouter.route('/push/:id')
  .post(
    [
      body('name').optional().isLength({ min: 1 }),
      body('collectionids').isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      if (Object(req.user).group.length == 0) {
        const validationErrors = validationResult(req);
        if (validationErrors.isEmpty()) {
          const groupService = new GroupService();
          try {
            const group = await groupService.getById(req.params.id);

            if (!group) {
              return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: `No Id Found`
              });
            }

            if (req.body.name) group.name = req.body.name;
            if (req.body.collectionids) {
              let collectionId: string = req.body.collectionids;
              group.collectionids.push(collectionId)

            }

            // console.log("Req------>",req.body);
            // console.log("Groups------>",group);

            const updatedGroup = await groupService.update(group);
            res.status(HttpStatus.OK).json({
              success: true,
              user: updatedGroup
            });
          } catch (err) {
            const error: ErrorStructure = {
              code: HttpStatus.BAD_REQUEST,
              errorObj: err
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
      } else {
        res.status(401).json({
          success: false,
          data: { "message": "You Are Not Authorized" }
        });
      }
    })
export default groupRouter;
