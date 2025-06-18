import { Router } from 'express';
import { authLimiter } from './auth-limiter.middleware';
import { asyncHandler } from '../../utils/async-handler';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';
import { signUp, login, refreshAccessToken, logout } from './auth.controller';

const router = Router();

router.post('/signup', signUp);

router.post('/login', authLimiter, login);

router.post('/refresh-token', refreshAccessToken);

router.post('/logout', authenticateToken, logout);

export default router;