import { Router } from 'express';
import { deleteUser, getUserData, updateUserData } from './user.controller';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = Router();

router.get('/user', authenticateToken, getUserData);

router.patch('/user', authenticateToken, updateUserData);

router.delete('/user', authenticateToken, deleteUser);

export default router 