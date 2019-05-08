import express from 'express';
import usersRoutes from './users.route';
import authRoutes from './auth.route';

const router = express.Router(); 


router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

export default router;
