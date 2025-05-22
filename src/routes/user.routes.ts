import { Router } from 'express';
import { getUserProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';

const router = Router();

router.get('/user', authenticateToken, (req, res, next) => {
    getUserProfile(req, res).catch(next);
});

export default router 