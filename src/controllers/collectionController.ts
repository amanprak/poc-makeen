import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { CollectionService } from '../services/collectionService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import { GroupService } from '../services/groupService';
import { request } from 'http';

// GET
sw.swagger({
  api: "/collection",
  method: "get",
  summary: "Fetch all the collections",
  tags: "COLLECTION",
  fields: [
  ]
});

// GET BY ID
sw.swagger({
  api: "/collection/{id}",
  method: "get",
  summary: "Fetch collection by id",
  tags: "COLLECTION",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
});

//POST
sw.swagger({
  api: "/collection",
  method: "post",
  summary: "Create a collection",
  tags: "COLLECTION",
  fields: [
    "name",
  ]
})

//PUT
sw.swagger({
  api: "/collection/{id}",
  method: "put",
  summary: "Edit a collection by id",
  tags: "COLLECTION",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name"
  ]
})

//DELETE
sw.swagger({
  api: "/collection/{id}",
  method: "delete",
  summary: "Delete a collection by id",
  tags: "COLLECTION",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
})




const collectionRouter: Router = Router();

collectionRouter.route('/')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const collectionService = new CollectionService();

    try {
      console.log("Request----->", req.user);

      // const groupService = new GroupService();
      // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
      //   let finalResult = []
      //   for (const i of Object(req.user).group) {
      //     let temp = (await groupService.getById(i.id));
      //     for (const iterator of temp.collectionids) {
      //       let tempRes = await collectionService.getById(iterator);
      //       console.log(tempRes);

      //       if (finalResult.indexOf(tempRes) == -1) finalResult.push(tempRes)
      //     }
      //   }
      //   res.status(HttpStatus.OK).json({
      //     success: true,
      //     data: finalResult
      //   });
      // } else if (Object(req.user).group.length == 0) {
      
      const response = await collectionService.getCollectionByGroup(req.user['filter']);
      res.status(HttpStatus.OK).json({
        success: true,
        data: response
      });
      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }


    } catch (err) {
      let error: ErrorStructure = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err
      };
      next(error);
    }
  })
  .post(
    [
      body('name').isLength({ min: 1 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      const validationErrors = validationResult(req);

      if (validationErrors.isEmpty()) {
        const collectionService = new CollectionService();
        await collectionService.createCollection(req.body);
        try {
          const response = await collectionService.insert(req.body);
          console.log("Response----->", response);

          // const groupService = new GroupService();
          // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          // let response = [];
          // for (const i of Object(req.user).group) {
          //   let temp = (await groupService.getById(i.id));
          //   temp.collectionids.push(Object(response).id);
          //   groupService.update(temp);

          // }
          // }
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

    });


collectionRouter.route('/:id')

  .get(async (req: Request, res: Response, next: NextFunction) => {

    const collectionService = new CollectionService();
    try {
      const collection = await collectionService.getById(req.params.id);
      console.log("Collection----->", collection);
      let validRole = 0;
      // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
      //   for (const i of Object(req.user).group) {
      //     let temp = (await collectionService.hasGroup(i.id));
      //     console.log("Temp------>", req.body.roleids);
      //     if (temp.includes(req.params.id)) {
      //       validRole = 1;
      //       break;
      //     }
      //   }
      //   if (validRole == 0) {
      //     const error: ErrorStructure = {
      //       code: 401,
      //       errorObj: { "message": "You are not authorized" }
      //     };
      //     next(error);
      //   } else {
      //     if (!collection) {
      //       res.status(HttpStatus.NOT_FOUND).json({
      //         success: false,
      //         message: `Item Not Found`
      //       });
      //       return;
      //     }
      //     res.status(HttpStatus.OK).json({
      //       success: true,
      //       collection: collection
      //     });
      //   }
      // }
      // else if (Object(req.user).group.length == 0) {

      if (!collection) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Item Not Found`
        });
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        collection: collection
      });
      // } else {
      //   res.status(401).json({
      //     success: false,
      //     data: { "message": "You Are Not Authorized" }
      //   });
      // }
      // if collection not found

      // return found collection


    } catch (err) {
      const error: ErrorStructure = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: err
      };
      next(error);
    }

  })

  .put(
    [
      body('name').optional().isLength({ min: 1 }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const collectionService = new CollectionService();
        try {
          const collection = await collectionService.getById(req.params.id);
          let validRole = 0;
          // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          //   for (const i of Object(req.user).group) {
          //     let temp = (await collectionService.hasGroup(i.id));
          //     console.log("Temp------>", req.body.roleids);
          //     if (temp.includes(req.params.id)) {
          //       validRole = 1;
          //       break;
          //     }
          //   }
          //   if (validRole == 0) {
          //     const error: ErrorStructure = {
          //       code: 401,
          //       errorObj: { "message": "You are not authorized" }
          //     };
          //     next(error);
          //   } else {
          //     if (!collection) {
          //       return res.status(HttpStatus.NOT_FOUND).json({
          //         success: false,
          //         message: `No Id Found`
          //       });
          //     }

          //     if (req.body.name) collection.name = req.body.name;

          //     const updatedCollection = await collectionService.update(collection);
          //     res.status(HttpStatus.OK).json({
          //       success: true,
          //       user: updatedCollection
          //     });
          //   }
          // }
          // else if (Object(req.user).group.length == 0) {
          if (!collection) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `No Id Found`
            });
          }

          if (req.body.name) collection.name = req.body.name;

          const updatedCollection = await collectionService.update(collection);
          res.status(HttpStatus.OK).json({
            success: true,
            user: updatedCollection
          });
          // } else {
          //   res.status(401).json({
          //     success: false,
          //     data: { "message": "You Are Not Authorized" }
          //   });
          // }

        } catch (err) {
          // db errors e.g. unique constraints etc
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
    })
  .delete(
    [
      body('id').optional().isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const collectionService = new CollectionService();
        try {
          const collection = await collectionService.getById(req.params.id);

          let validRole = 0;
          // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          //   for (const i of Object(req.user).group) {
          //     let temp = (await collectionService.hasGroup(i.id));
          //     console.log("Temp------>", req.body.roleids);
          //     if (temp.includes(req.params.id)) {
          //       validRole = 1;
          //       break;
          //     }
          //   }
          //   if (validRole == 0) {
          //     const error: ErrorStructure = {
          //       code: 401,
          //       errorObj: { "message": "You are not authorized" }
          //     };
          //     next(error);
          //   } else {
          //     let recordId: string = req.params.id;

          //     const deleteRes = await collectionService.remove(recordId);
          //     res.status(HttpStatus.NO_CONTENT).json({
          //       success: true,
          //       deleteRes
          //     });
          //   }
          // }
          // else if (Object(req.user).group.length == 0) {
          let recordId: string = req.params.id;

          const deleteRes = await collectionService.remove(recordId);
          res.status(HttpStatus.NO_CONTENT).json({
            success: true,
            deleteRes
          });
          // }
          if (!collection) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `No Id Found`
            });
          }
          // else{

        } catch (err) {
          // db errors e.g. unique constraints etc
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
    })

export default collectionRouter;
