import { Router } from 'express';
import { signUp, login } from './auth.controller';
import { authLimiter } from '../../middlewares/auth-limiter.middleware';

const router = Router();

router.post('/signup', (req, res, next) => {
    signUp(req, res).catch(next);
});

router.post('/login', authLimiter, (req, res, next) => {
    login(req, res).catch(next);
});

export default router;