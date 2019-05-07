import express from 'express';
import usersRoutes from './users.route';

const router = express.Router(); 


router.use('/users', usersRoutes);

export default router;
