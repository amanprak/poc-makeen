import * as HttpStatus from 'http-status-codes';
import { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator/check';
import { ItemService } from '../services/itemService';
import * as sw from '../config/swagger.js'
import { ErrorStructure } from '../utilites/ErrorStructure';
import config from '../config/config';
const { errors } = config;
// GET
sw.swagger({
  api: "/item",
  method: "get",
  summary: "Fetch all the items",
  tags: "ITEM",
  fields: [
  ]
});

// GET BY ID
sw.swagger({
  api: "/item/{id}",
  method: "get",
  summary: "Fetch item by id",
  tags: "ITEM",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
});

//POST
sw.swagger({
  api: "/item",
  method: "post",
  summary: "Create a item",
  tags: "ITEM",
  fields: [
    "name",
    "collection"
  ]
})

//PUT
sw.swagger({
  api: "/item/{id}",
  method: "put",
  summary: "Edit a item by id",
  tags: "ITEM",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
    "name",
    "collection"
  ]
})

//DELETE
sw.swagger({
  api: "/item/{id}",
  method: "delete",
  summary: "Delete a item by id",
  tags: "ITEM",
  fields: [
    { name: "id", required: false, in: "path", type: "string" },
  ]
})




const itemRouter: Router = Router();

itemRouter.route('/')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const itemService = new ItemService();

    try {

      // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
      //   let response = [];
      //   for (const i of Object(req.user).group) {
      //     let temp = (await itemService.getItemByGroup(i.id));
      //     if (response.indexOf(temp) == -1) response.push(temp)
      //     console.log("User---->", response);

      //   }
      //   res.status(HttpStatus.OK).json({
      //     success: true,
      //     data: response
      //   });
      // } else if (Object(req.user).group.length == 0) {
      // const response = await userService.getAll();
      const response = await itemService.getAll();
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


      // const response = await itemService.getAll();
      // res.status(HttpStatus.OK).json({
      //   success: true,
      //   data: response
      // });
    } catch (err) {
      let error: ErrorStructure = {
        code: HttpStatus.BAD_REQUEST,
        errorObj: errors.bad_request
      };
      next(error);
    }
  })
  .post(
    [
      body('name').isLength({ min: 1 }),
      body('collection').optional().isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {

      const validationErrors = validationResult(req);

      if (validationErrors.isEmpty()) {
        const itemService = new ItemService();
        console.log("Body--->", req.body);

        await itemService.createItem(req.body);
        // const collectionService = new CollectionService();

        try {
          //   let validRole = 0;
          //   if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          //     for (const i of Object(req.user).group) {
          //       let temp = (await collectionService.hasGroup(i.id));
          //       console.log("Temp------>", req.body.roleids);

          //       if (temp.some(item => (req.body.roleids.includes(item)))) {
          //         console.log("Valid Case");
          //         validRole = 1;
          //         break;
          //       }
          //     }
          //     if (validRole == 0) {
          //       const error: ErrorStructure = {
          //         code: 401,
          //         errorObj: { "message": "You are not authorized" }
          //       };
          //       next(error);
          // } else {
          //       // await itemService.createItem(req.body);
          const response = await itemService.insert(req.body);
          res.status(HttpStatus.OK).json({
            success: true,
            data: response
          });
          //   }
          // } else if (Object(req.user).group.length == 0) {
          //   const response = await itemService.insert(req.body);
          //   res.status(HttpStatus.OK).json({
          //     success: true,
          //     data: response
          //   });
          // } else {
          //   const error: ErrorStructure = {
          //     code: 401,
          //     errorObj: { "message": "You are not authorized" }
          //   };
          //   next(error);
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


itemRouter.route('/:id')

  .get(async (req: Request, res: Response, next: NextFunction) => {

    const itemService = new ItemService();
    try {
      const item = await itemService.getById(req.params.id);
      // const collectionService = new CollectionService();
      // let validRole = 0;
      // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
      //   for (const i of Object(req.user).group) {
      //     let temp = (await collectionService.hasGroup(i.id));
      //     console.log("Temp------>", req.body.roleids);

      //     if (temp.some(item => (req.body.roleids.includes(item)))) {
      //       console.log("Valid Case");
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
      //     // await itemService.createItem(req.body);
      //     if (!item) {
      //       res.status(HttpStatus.NOT_FOUND).json({
      //         success: false,
      //         message: `Item Not Found`
      //       });
      //       return;
      //     }
      //     // return found item
      //     res.status(HttpStatus.OK).json({
      //       success: true,
      //       item: item
      //     });
      //   }
      // } else if (Object(req.user).group.length == 0) {
      if (!item) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Item Not Found`
        });
        return;
      }
      // return found item
      res.status(HttpStatus.OK).json({
        success: true,
        item: item
      });
      // } else {
      //   const error: ErrorStructure = {
      //     code: 401,
      //     errorObj: { "message": "You are not authorized" }
      //   };
      //   next(error);
      // }
      // if item not found


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
      body('name').optional().isLength({ min: 1 }),
      body('collection').optional().isUUID(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (validationErrors.isEmpty()) {
        const itemService = new ItemService();
        try {
          const item = await itemService.getById(req.params.id);
          // const collectionService = new CollectionService();
          // let validRole = 0;
          // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          //   for (const i of Object(req.user).group) {
          //     let temp = (await itemService.getItemByGroup(i.id));
          //     console.log("Temp------>", temp);

          //     if (temp.some(item => (item.includes(req.params.id)))) {
          //       console.log("Valid Case");
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
          //     if (!item) {
          //       return res.status(HttpStatus.NOT_FOUND).json({
          //         success: false,
          //         message: `No Id Found`
          //       });
          //     }

          //     if (req.body.name) item.name = req.body.name;
          //     if (req.body.collection) item.name = req.body.collection;

          //     const updatedItem = await itemService.update(item);
          //     res.status(HttpStatus.OK).json({
          //       success: true,
          //       user: updatedItem
          //     });
          //   }
          // } else if (Object(req.user).group.length == 0) {
          if (!item) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `No Id Found`
            });
          }

          if (req.body.name) item.name = req.body.name;
          if (req.body.collection) item.name = req.body.collection;

          const updatedItem = await itemService.update(item);
          res.status(HttpStatus.OK).json({
            success: true,
            user: updatedItem
          });
          // } else {
          //   const error: ErrorStructure = {
          //     code: 401,
          //     errorObj: { "message": "You are not authorized" }
          //   };
          //   next(error);
          // }

        } catch (err) {
          // db errors e.g. unique constraints etc
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
        const itemService = new ItemService();
        try {
          const item = await itemService.getById(req.params.id);
          // const collectionService = new CollectionService();
          // let validRole = 0;
          // if (Object(req.user).group.length > 0 && Object(Object(req.user).role[0]).name == "manager") {
          //   for (const i of Object(req.user).group) {
          //     let temp = (await collectionService.hasGroup(i.id));
          //     console.log("Temp------>", req.body.roleids);

          //     if (temp.some(item => (req.body.roleids.includes(item)))) {
          //       console.log("Valid Case");
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
          //     if (!item) {
          //       return res.status(HttpStatus.NOT_FOUND).json({
          //         success: false,
          //         message: `No Id Found`
          //       });
          //     }
          //     // else{
          //     let recordId: string = req.params.id;
          //     // }

          //     const deleteRes = await itemService.remove(recordId);
          //     res.status(HttpStatus.NO_CONTENT).json({
          //       success: true,
          //       deleteRes
          //     });
          //   }
          // } else if (Object(req.user).group.length == 0) {
          if (!item) {
            return res.status(HttpStatus.NOT_FOUND).json({
              success: false,
              message: `No Id Found`
            });
          }
          // else{
          let recordId: string = req.params.id;
          // }

          const deleteRes = await itemService.remove(recordId);
          res.status(HttpStatus.NO_CONTENT).json({
            success: true,
            deleteRes
          });
          // } else {
          //   const error: ErrorStructure = {
          //     code: 401,
          //     errorObj: { "message": "You are not authorized" }
          //   };
          //   next(error);
          // }

        } catch (err) {
          // db errors e.g. unique constraints etc
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

export default itemRouter;
