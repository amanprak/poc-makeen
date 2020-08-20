import { Router } from 'express';

import collectionRouter from './controllers/collectionController';
import groupRouter from './controllers/groupController';
import roleRouter from './controllers/roleController';
import itemRouter from './controllers/itemController';
import userRouter from './controllers/userController';
import { AuthHandler } from './config/authHandler';
import tokenRouter from './controllers/tokenController';
const router: Router = Router();
const auth = new AuthHandler();

router.use('/collection', auth.authenticate(), collectionRouter);
router.use('/group', auth.authenticate(), groupRouter);
router.use('/role', auth.authenticate(), roleRouter);
router.use('/item', auth.authenticate(), itemRouter);
router.use('/user', auth.authenticate(), userRouter);
router.use('/token', tokenRouter);

export default router;
