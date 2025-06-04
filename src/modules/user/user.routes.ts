import { Router } from 'express';
import { deleteUser, getUserData, updateUserData } from './user.controller';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = Router();

router.get('/user', authenticateToken, (req, res, next) => {
    getUserData(req, res).catch(next);
});

router.patch('/user', authenticateToken, (req, res, next) => {
    updateUserData(req, res).catch(next);
});

router.delete('/user', authenticateToken, (req, res, next) => {
    deleteUser(req, res).catch(next);
});

export default router 