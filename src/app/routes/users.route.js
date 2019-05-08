import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();


router.route('/')
     .get(userController.list);


export default router;