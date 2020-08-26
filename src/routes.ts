import { Router } from 'express';

import collectionRouter from './controllers/collectionController';
import groupRouter from './controllers/groupController';
import roleRouter from './controllers/roleController';
import itemRouter from './controllers/itemController';
import userRouter from './controllers/userController';
import { AuthHandler } from './config/authHandler';
import tokenRouter from './controllers/tokenController';
import * as welcomeController from './controllers/welcomeController';
import { permissions } from './permissions/permissions';

const router: Router = Router();
const auth = new AuthHandler();

router.use('/token', tokenRouter);
router.use('/collection',collectionRouter);
router.use('/item', itemRouter);
router.use(auth.authenticate());
router.use(permissions);
router.get('/', welcomeController.index);
router.use('/group',  groupRouter);
router.use('/role', roleRouter);
router.use('/user', userRouter);

export default router;
