import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { signUp, login, refreshAccessToken, logout } from './auth.controller';
import { authLimiter } from './auth-limiter.middleware';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = Router();

router.post('/signup', asyncHandler(signUp));

router.post('/login', authLimiter, asyncHandler(login));

router.post('/refresh-token', asyncHandler(refreshAccessToken));

router.post('/logout', authenticateToken, asyncHandler(logout));

export default router;