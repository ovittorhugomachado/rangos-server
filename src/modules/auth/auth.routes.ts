import { Router } from 'express';
import { signUp, login, refreshAccessToken, logout } from './auth.controller';
import { authLimiter } from './auth-limiter.middleware';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = Router();

router.post('/signup', (req, res, next) => {
    signUp(req, res).catch(next);
});

router.post('/login', authLimiter, (req, res, next) => {
    login(req, res).catch(next);
});

router.post('/refresh-token', (req, res, next) => {
  refreshAccessToken(req, res).catch(next);
});

router.post('/logout', authenticateToken, (req, res, next) => {
  logout(req, res).catch(next);
});

export default router;