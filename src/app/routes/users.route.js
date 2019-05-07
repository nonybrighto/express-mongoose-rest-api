import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();


router.route('/')
     .get(userController.list)
     .post(userController.add);


export default router;